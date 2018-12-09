from boa.interop.System.Storage import GetContext, Get, Put, Delete
from boa.interop.Ontology.Native import Invoke
from boa.builtins import ToScriptHash, state
from boa.interop.System.Runtime import Notify
from boa.interop.System.ExecutionEngine import GetExecutingScriptHash


# ONT Big endian Script Hash: 0x0100000000000000000000000000000000000000
OntContract = ToScriptHash("AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV")
# ONG Big endian Script Hash: 0x0200000000000000000000000000000000000000
OngContract = ToScriptHash("AFmseVrdL9f9oyCzZefL9tG6UbvhfRZMHJ")
OWNER = ToScriptHash("AFrVXcA9o9G3vQnwaEPyGf6ysd82X76gRv")
SUPPLY_KEY = 'TotalSupply'
ctx = GetContext()
ALL_USER = "ALL_USER"
HISTORY = "HISTORY"
INITIAL_PRICE = "InitPrice"

selfContractAddress = GetExecutingScriptHash()


def Main(operation, args):
    if operation == "getPrice":
        userid = args[0]
        return getPrice(userid)
    if operation == "getAmount":
        userid = args[0]
        return getAmount(userid)
    if operation == "transferOntOng":
        if len(args) == 4:
            fromAcct = args[0]
            toAcct = args[1]
            ontAmount = args[2]
            ongAmount = args[3]
            return transferOntOng(fromAcct, toAcct, ontAmount, ongAmount)
        else:
            return False
    if operation == "transferOngToContract":
        if len(args) == 2:
            fromAccount = args[0]
            ongAmount = args[1]
            return transferOngToContract(fromAccount, ongAmount)
        else:
            return False
    if operation == "checkSelfContractONGAmount":
        return checkSelfContractONGAmount()
    if operation =="invest":
        return invest()
    if operation == "buy":
        buyer = args[0]
        useradd = args[1]
        price = args[2]
        return buy(buyer, useradd,price)

    if operation == "getHistory":
        useradd = args[0]
        return getHistory(useradd)
    if operation == "delete":
        useradd = args[0]
        return delete(useradd)
    if operation == "showAll":
        return showAll()
    if operation=="registerStorage":
        if len(args) == 3:
            userid = args[0]
            price = args[1]
            amount = args[2]
            return registerStorage(userid,price,amount)
        else:
            return False
    return True

def delete(useradd):
    Delete(ctx, useradd)
    return True

def buy(buyer,useradd,price):
    res = Get(ctx,useradd)
    if not res:
        return False
    else :
        storage = Deserialize(res)
        sPrice = storage["Price"]
        Notify([sPrice, price])
        if sPrice <= price:

            storage["Buyer"] = 1 #aleady has bought
            # hisRes = Get(ctx,HISTORY)
            # hismap = Deserialize(hisRes)
            # if buyer in hismap:
            #     hismap[buyer].append([useradd,storage["Price"],storage["Amount"]])
            # else :
            #     hismap[buyer] = [[useradd,storage["Price"],storage["Amount"]]]
            Put(ctx,useradd,Serialize(storage))
            return True
        else :
            Notify("you are POOR!!")
            return False


def getHistory(buyeradd):
    reshis = Get(ctx,HISTORY)
    if not reshis:
        return False
    else:
        maphistory = Deserialize(reshis)
        hislist = maphistory[buyeradd]
        return hislist

def invest(account, ontAmount):
 # make sure the caller is actually the account
 if not CheckWitness(account):
     # if the caller is not the account
     return False
 # make sure the caller has transferred the correct amount of ONT into this contract(or account)
 params = state(account, selfContractAddress, ontAmount)
 res = Invoke(0, OntContract, "transfer", params)
 if not res:
     # the account should transfer ontAmount of ONT into this contract as investment, but he failed.
     return False

 # then, for example, we can record that the account has transferred amount of ONT into this GetContract
 return True

def showAll():
    res = Get(ctx,ALL_USER)
    reslst = []
    tlist = []
    if not res:
        return False
    else :
        useridlst = Deserialize(res)
        for i in useridlst:
            storage = Get(ctx,i)
            serialstorage = Deserialize(storage)
            # dic = {i:serialstorage}
            tlist.append([i,serialstorage["Price"], serialstorage["Amount"],serialstorage["Buyer"]])
            # reslst.append(dic)
        # return reslst
        return tlist

    # map2 = {"a": 2}
    # return map2 # is wrong
    # return map2["a"] # is correct
    # list2 =["2", 3,"fsgwfd"]
    # return list2 # is correct

def transferOntOng(fromAcct, toAcct, ontAmount, ongAmount):
 param = state(fromAcct, toAcct, ontAmount)
 res = Invoke(0, OntContract, "transfer", [param])
 if INITIAL_PRICE > ontAmount:
     return False
 if res != b'\x01':
     raise Exception("transfer ont error.")
 param = state(fromAcct, toAcct, ongAmount)
 Notify("transferONT succeed")
 res = Invoke(0, OngContract, "transfer", [param])
 if res != b'\x01':
     raise Exception("transfer ong error.")
 Notify("transferONG succeed")
 return True

def getPrice(userid):
 info = Get(ctx,userid)
 if not info :
     return
 else:
     infomap = Deserialize(info)
     return infomap["Price"]
def getAmount(userid):
 info = Get(ctx,userid)
 if not info:
     return
 else :
     infomap = Deserialize(info)
     return infomap["Amount"]

def transferOngToContract(fromAccount, ongAmount):
 Notify(["111_transferOngToContract", selfContractAddress])
 param = state(fromAccount, selfContractAddress, ongAmount)
 res = Invoke(0, OngContract, 'transfer', [param])
 if res and res == b'\x01':
     Notify('transfer Ong succeed')
     return True
 else:
     Notify('transfer Ong failed')
     return False

def addUser(userid):
    res = Get(ctx,ALL_USER)
    if not res:
        initialuserid = Serialize([userid])
        Put(ctx,ALL_USER,initialuserid)
    else:
        useridlst = Deserialize(res)
        exist = checkExist(userid, useridlst)
        if not exist:
            useridlst.append(userid)
            Put(ctx,ALL_USER,Serialize(useridlst))
    return True

def checkExist(userid, useridlst):
    for uid in useridlst:
        if uid == userid:
            return True
    return False

def registerStorage(userid,price,amount):
    addUser(userid)
    initialPriceMap = {
        "Price":price,
        "Amount":amount,
        "Buyer":0

    }
    serialPrice = Serialize(initialPriceMap)
    Put(ctx,userid,serialPrice)
    Notify([userid, price, amount])
    return True

def checkSelfContractONGAmount():
 param = state(selfContractAddress)
 # do not use [param]
 res = Invoke(0, OngContract, 'balanceOf', param)
 return res
