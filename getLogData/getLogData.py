from decouple import config
import subprocess, datetime, time
import mysql.connector

DBUSERNAME = config('DBUSERNAME')
DBPASSWORD = config('DBPASSWORD')
DBHOST = config('DBHOST')
DATABASE = config('DATABASE')

def ConnectToDatbase():
    CONN = mysql.connector.connect(
        user=DBUSERNAME, 
        password=DBPASSWORD,
        host=DBHOST, 
        database=DATABASE)

    return CONN

def GetLogData():

    command = "sudo grep '^CLIENT_LIST' /var/log/openvpn/openvpn-status.log | awk -F',' '{print $2, $3, $4, $5, $6, $7, $8}'"

    output = subprocess.check_output(command, shell=True, universal_newlines=True)

    lines = output.split('\n')

    if lines[-1] == '':
        lines.pop()

    return lines


def SetAllSessionsToInActive():
    query = "UPDATE Session SET Active = 0, ConnectedEnd = %s WHERE Active = 1"
    values = [datetime.datetime.now()]
    cur.execute(query, values)
    CONN.commit()


def CheckActiveConnections(UserIds):

    query = "SELECT UserId from Session"
    cur.execute(query)
    activeSessions = cur.fetchall()

    for session in activeSessions:

        UserId = session[0]
        if str(UserId) not in UserIds:
            query = "UPDATE Session SET Active = 0, ConnectedEnd = %s  WHERE UserId = %s"
            values = [UserId, datetime.datetime.now()]
            cur.execute(query, values)
            CONN.commit()


def UpdateDatabase(userIds, logData):
    for user in logData:

        userData = user.split(" ")
        userData.pop(3)

        query = "SELECT * from Session WHERE UserId = %s AND Active = 1"
        values = [userData[0]]
        cur.execute(query, values)
        recordExists = cur.fetchall()

        if ( len(recordExists) > 0):

            query = "UPDATE Session SET BytesIn = %s, BytesOut = %s  WHERE UserId = %s"
            values = [userData[3], userData[4], userData[0]]
            cur.execute(query, values)
            CONN.commit()

        else:
            query = "INSERT INTO Session (UserId, SourceIP, VPNIP, BytesIn, BytesOut, ConnectedStart) VALUES (%s, %s, %s, %s, %s, %s)"
            values = [userData[0], userData[1].split(":")[0], userData[2], userData[3], userData[4], f'{userData[5]} {userData[6]}']
            cur.execute(query, values)
            CONN.commit()


def IngestLogData(logData):

    if (len(logData) == 0):
        SetAllSessionsToInActive()

    else:

        userIds = []

        for line in logData:
            userIds.append(line.split(' ')[0])

        CheckActiveConnections(userIds)

        UpdateDatabase(userIds, logData)

if __name__ == "__main__":
    while True:
        CONN = ConnectToDatbase()
        cur = CONN.cursor()

        logData = GetLogData()
        IngestLogData(logData)

        CONN.close()
        time.sleep(10)
