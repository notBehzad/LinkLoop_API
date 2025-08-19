from fastapi import FastAPI, WebSocket as WS, WebSocketDisconnect
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import time
import json, os
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

firebase_json = os.getenv("FIREBASE_JSON")
creds_dict = json.loads(firebase_json)
creds = credentials.Certificate(creds_dict)
firebase_admin.initialize_app(creds,{'databaseURL': 'https://behzad-db-default-rtdb.asia-southeast1.firebasedatabase.app/'})

@app.websocket('/ws')
async def handle_user(ws: WS):
    await ws.accept()
    data={
        "user_id":None,
        "chat_key":None,
        "receiver":None,
        "i_added":False,
        "new_added":False
        }


    try:
        while data["user_id"] is None:
            request = await ws.receive_text()
            request = json.loads(request) 
            if request['request_type']=='login':
                response=login(request['username'], request['password'], data)
                response = json.dumps(response)
                await ws.send_text(response)

            elif request['request_type']=='signup':
                create_account(request['nickname'], request['username'], request['password'], data)
                await ws.send_text("good")

        loop = asyncio.get_running_loop()
        db.reference(f'/users/{data["user_id"]}/listen').listen(
            lambda event, webSoc=ws: asyncio.run_coroutine_threadsafe(
                live_updater(event, webSoc, data), loop
            )
        )

        await ws.send_text(db.reference(f'/users/{data["user_id"]}/name').get())

        await ws.send_text(json.dumps(get_contact_list(data["user_id"])))

        while True:
            request = await ws.receive_text()
            request = json.loads(request) 
            if request['type']=='add_contact':
                await ws.send_text(json.dumps(add_contact(request['id'], data, ws)))

            elif  request['type']=='open_chat':
                await ws.send_text(json.dumps(open_chat(request['id'], data)))

            elif  request['type']=='send':
                print('js sent a message')
                print(ws)
                await send_message(request["text"], data, ws)

    except WebSocketDisconnect:
        update_status(False, data['user_id'])


@app.get('/id_available/{id}')
def is_id_available(id: str):
    if db.reference(f'/users/{id}').get() is None:
        return True
    else: 
        return False

def create_account(name,id,password, data):           ### updated
        db.reference('/users').child(id).set({'name':name, 'pass':password, 'status': 'Active', 'listen': {'contacts': {'empty':'empty'}}})
        db.reference('/admin/user_ids/').update({id: name})
        data["user_id"]=id


def login(id, password, data):           ### updated
        if db.reference(f'/users/{id}').get() is not None:
            if db.reference(f'/users/{id}/pass').get()==password:
                data["user_id"]=id
                update_status(True, id)
                return {'result':True}
            else: return {'result':'Incorrect password'}
        else: return {'result': 'Username not found'}

def update_status(switch: bool, id):           ### updated
        if id is not None:
            if switch:
                state="Active"
            else:
                state=f'Last online: {datetime.now().strftime("%I:%M %p, %d %b %Y")}'

            db.reference(f'/users/{id}').update({'status':state})
            if db.reference(f'/users/{id}/listen/contacts/empty').get() is None:
                ids=db.reference(f'/users/{id}/listen/contacts').get().keys()
                for id_ in ids:
                    db.reference(f'/users/{id_}/listen/contacts/{id}').update({'status':state})


@app.get('/get_name/{user}')
def get_name(user: str):           ### updated
        return db.reference(f'/users/{user}/name').get()


def get_contact_list(id):           ### updated
        if db.reference(f'/users/{id}/listen/contacts/empty').get() is not None: 
            return False
        else:
            contacts = db.reference(f'/users/{id}/listen/contacts').get()
            data = []
            for contact_id, contact_data in contacts.items():
                data.append([contact_id, contact_data.get('last_message')[:20].replace("\n", "").replace("\r", "")+'...', contact_data.get('new_messages_count'), contact_data.get('status')])
            return data

@app.get("/get_all_usernames")
def get_all_usernames():           ### updated
        data=db.reference(f'/admin/user_ids').get()
        return list(data.keys())


def add_contact(id, data, ws):         ### updated
        user_id=data['user_id']

        if user_id==id: return False

        if db.reference(f'/users/{id}').get() is not None and db.reference(f'/users/{user_id}/listen/contacts/{id}').get() is None:
            data["receiver"]=id
            data["i_added"]=True
            data["new_added"]=True

            data["chat_key"]=db.reference('/chats').push().key

            me = db.reference(f'/users/{user_id}/listen/contacts')
            other = db.reference(f'/users/{id}/listen/contacts')

            me.child(id).set({
                'he_opened':False,
                'key':data["chat_key"],
                'new_messages_count':0,
                'status': get_status(id)
                })

            if db.reference(f'/users/{user_id}/listen/contacts/empty').get() is not None: 
                me.child('empty').delete()

            other.child(user_id).set({
                'he_opened':False,
                'key':data["chat_key"],
                'new_messages_count':0,
                'status': 'Active'
                })
            if db.reference(f'/users/{id}/listen/contacts/empty').get() is not None: 
                other.child('empty').delete()

            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

            loop.create_task(send_message(f"Hi, I'm {user_id}. Lets chat!", data, ws))


            return True

        else: return False

async def send_message(text, data, ws):           ### updated
        user_id=data['user_id']
        key=int(time.time())
        time_=datetime.now().strftime("%I:%M %p, %d %b %Y")
        message={
            'time':time_,
            'content': text,
            'sender':user_id,
            }
        
        if not data["new_added"]:

            print(ws)
            await ws.send_text(json.dumps({
                'type': 'add_message',
                'key': key,
                'message': text,
                'time': time_,
                'is_me': True
                }))


        chat_space=db.reference(f'/chats/{data["chat_key"]}')
        db.reference(f'/users/{user_id}/listen/contacts/{data["receiver"]}').update({
            'he_opened': False,
            'last_message':f'You: {text}'
            })

        count = db.reference(f'/users/{data["receiver"]}/listen/contacts/{user_id}/new_messages_count').get()
        db.reference(f'/users/{data["receiver"]}/listen/contacts/{user_id}').update({
            'new_messages_count': count+1,
            'last_message':f'{user_id}: {text}'
            })
        
        chat_space.child(str(key)).set(message)

        if data["new_added"]:
            data["new_added"]=False
            data["chat_key"]=None


def get_status(id):           ### updated
        return db.reference(f'/users/{id}/status').get()

def open_chat(id, data):           ### updated
        data["chat_key"]=db.reference(f'/users/{data["user_id"]}/listen/contacts/{id}/key').get()
        if data["chat_key"] is not None:
            data["receiver"]=id

            count=db.reference(f'/users/{data["user_id"]}/listen/contacts/{id}/new_messages_count').get()
            is_new=True
            if count==0: 
                is_new=False
                count=db.reference(f'/users/{id}/listen/contacts/{data["user_id"]}/new_messages_count').get()

            db.reference(f'/users/{id}/listen/contacts/{data["user_id"]}').update({'he_opened': True})
            db.reference(f'/users/{data["user_id"]}/listen/contacts/{id}').update({'new_messages_count': 0})

            return {
                'chats': db.reference(f'/chats/{data["chat_key"]}').order_by_key().limit_to_last(50).get(),
                'count': count,
                'is_new': is_new
                }



async def live_updater(event, ws, data):                        ### new
    user_id=data['user_id']
    if event.data==None: return

    if (event.event_type=='put' or event.event_type=='patch') and event.path!='/':

        data_=list(event.data.keys())
        id = event.path.strip("/").split("/")[1]

        if len(data_)==4:                         ### someone added

            await ws.send_text(json.dumps({
                'type': 'make_contact_button',
                'id': id,
                'last_message': ' ',
                'new_count': 1,
                'status': 'Active'
                }))

            if data['i_added'] is True:
                data['i_added']=False
                return

            await ws.send_text(json.dumps({
                'type': 'notification',
                'sender': id,
                'content': f'{id} has added you',
                'count': 1,
                }))

            return
        

        if 'last_message' in data_:
            last=event.data['last_message'][:20].replace("\n", "").replace("\r", "")+'...'

            await ws.send_text(json.dumps({
                'type': 'update_last_message',
                'id': id,
                'last_message': last
                }))

        if 'new_messages_count' in data_:       ### live messages
            if event.data['new_messages_count']==0: return

            key=db.reference(f'/users/{user_id}/listen/contacts/{id}/key').get()

            stamp, message = next(iter(db.reference(f'/chats/{key}').order_by_key().limit_to_last(1).get().items()))

            if data['chat_key']==key:
                await ws.send_text(json.dumps({
                'type': 'add_message',
                'key': stamp,
                'message': message['content'],
                'time': message['time'],
                'is_me': False
                }))

                db.reference(f'/users/{id}/listen/contacts/{user_id}').update({'he_opened': True})
                db.reference(f'/users/{user_id}/listen/contacts/{id}').update({'new_messages_count': 0})
            else:
                content=message['content'][:20].replace("\n", "").replace("\r", "")+'...'
                await ws.send_text(json.dumps({
                'type': 'notification',
                'sender': id,
                'content': f'{id}: {content}...',
                'count': db.reference(f'/users/{user_id}/listen/contacts/{id}/new_messages_count').get()
                }))

            return

        if 'he_opened' in data_:      ### live seen update

            if event.data['he_opened']==True: 
                await ws.send_text(json.dumps({
                'type': 'update_seen'
                }))
            return

        if 'status' in data_:      ### live status update
            
            status=event.data['status']

            await ws.send_text(json.dumps({
                'type': 'update_status',
                'id': id,
                'status': status
                }))