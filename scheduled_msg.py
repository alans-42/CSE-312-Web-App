import threading, time

class ScheduledMSG():
    def __init__(self, msgID, timer):
        self.thread = threading.Thread(target=self.msg_timer)
        self.msgID = msgID
        self.remaining = timer * 60
        self.running = True
        self.start_timer()

    def msg_timer(self):
        while self.remaining >= 0:
            time.sleep(1)
            self.remaining -= 1

        self.running = False

    def start_timer(self):
        self.thread.start()
