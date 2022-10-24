import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time

Ros = "Ros-ceschhrqfvffpf74okioif3eau-dev" # TABLE NAME

resource = boto3.resource('dynamodb')
client = boto3.client('dynamodb')
table = resource.Table(Ros)

class item():
    def __init__(self, pos):
        self.pos = pos
        self.response = {"started": False}
        self.whichPos()      

        
    def whichPos(self):
        if self.pos == 1:
            self.posID = "632fc8e2-90cf-480c-9574-276a4dc348c6"
        elif self.pos == 2:
            self.posID = "53160c3a-ea6b-4d91-a800-a34112866437"
        elif self.pos == 3:
            self.posID = "b06d6812-afbf-4a7a-afa6-c4784b94c1ab"

    def get_item(self):
        query = {"KeyConditionExpression": Key("id").eq(self.posID)}
        self.response = table.query(**query)
        # print(response)
        return self.response['Items'][0]
    
    def observeStart(self):
        initialStarted = self.response['Items'][0]['started']
        if(initialStarted == False):
            started = self.get_item()["started"]
            while started == False:
                started = self.get_item()["started"]
                print("Waiting for start...")
                time.sleep(2)
            print('시작됨!')
						# waypoint 찍기
        else :
            print("이미 시작됨")

		# 도착했을 때 실행
    def sendArrived(self):
        query = {"KeyConditionExpression": Key("id").eq(self.posID)}
        response = table.update_item(
            Key={'id':self.posID},
            UpdateExpression='SET arrived = :val1',
            ExpressionAttributeValues={
                ':val1':True})
        if(response['ResponseMetadata']['HTTPStatusCode'] == 200):
            # 응답 성공
            print("도착했음")
            print(response)
            arrived = self.get_item()["arrived"]
            print("arrived: ",arrived)
            return arrived

        else:
            print("데이터베이스 연결 실패")

        
            

# [pos1, pos2, pos3] = [item(1), item(2), item(3)]
# [pos1Item, pos2Item, pos3Item] = [pos1.get_item(), pos2.get_item(), pos3.get_item()]

# print("pos1Item: ",pos1Item["started"])
        

# pos2.observeStart()
# pos1.sendArrived()

# path tracking
class Path ():
    def __init__(self):
        self.path = {
            'pos_x' : 0.0,
            'pos_y' : 0.0,
        }
        self.isDriving = True
    
    def changePose(self, pos_x, pos_y):
        self.path['pos_x'] = pos_x
        self.path['pos_y'] = pos_y
        print(self.path)
    
    def startLoop(self):
        while self.isDriving:
            isDriving = input("운행 중인가요? (y/n)")
            if(isDriving == 'n'):
                self.isDriving = False                
            else:  
                pos_x = input("input pos_x")
                pos_y = input("input pos_y")
                self.changePose(pos_x, pos_y)
                
    def sendPos(self):
        query = {"KeyConditionExpression": Key("id").eq(0)}
        response = table.update_item(
            Key={'id':self.posID},
            UpdateExpression='SET pos = :val1',
            ExpressionAttributeValues={
                ':val1':self.path})
        if(response['ResponseMetadata']['HTTPStatusCode'] == 200):
            # 응답 성공
            print("포지션 변경 완료")
            print(response)
            print("pos: ",self.path)

        else:
            print("데이터베이스 연결 실패")
                
                
path = Path()
path.startLoop()