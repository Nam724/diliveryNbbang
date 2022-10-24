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

                
                
path = Path()
path.startLoop()