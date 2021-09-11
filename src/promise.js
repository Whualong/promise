const pending="PENDING";
const fufilled="FUFILLED";
const rejected="REJECTED";

class Promise{
    constructor(exector){
        this.status=pending;
        this.value=undefined;
        this.reason=undefined;
        this.onFufilledCallback=[];
        this.onRejectedCallback=[];
        let resolve=(val)=>{
            if(this.status===pending){
                this.status=fufilled;
                this.value=val;
                this.onFufilledCallback.forEach((fn)=>{
                    fn();
                })
            }
        }
        let reject=(val)=>{
            if(this.status===pending){
                this.status=rejected;
                this.reason=val;
                this.onRejectedCallback.forEach((fn)=>{
                    fn();
                })
            }
        }
        try{
            exector(resolve,reject);
        }catch(e){
            reject(e);
        }
       
    }
    then(onFufilled,onRejected){
        onFufilled=typeof onFufilled==='function'?onFufilled:val=>val;
        onRejected=typeof onRejected==='function'?onRejected:err=>{throw err};
        let promise2=new Promise((resolve,reject)=>{
            if(this.status===fufilled){
                queueMicrotask(()=>{
                    try{
                        let x=onFufilled(this.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e)
                    }
                })
            }
            if(this.status===rejected){
                queueMicrotask(()=>{
                    try{
                        let x=onRejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e)
                    }
                })
            }
            if(this.status===pending){
                this.onFufilledCallback.push(()=>{
                    queueMicrotask(()=>{
                        try{
                            let x=onFufilled(this.value);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e)
                        }
                    })
                })
                this.onRejectedCallback.push(()=>{
                    queueMicrotask(()=>{
                        try{
                            let x=onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e)
                        }
                    })
                })
            }
        })
        return promise2;
    }
    catch(fn){
        return this.then(null,fn);
    }
}
//resolve方法
Promise.resolve = (val)=>{
return new Promise((resolve,reject)=>{
    resolve(val)
});
}
//reject方法
Promise.reject = (val)=>{
return new Promise((resolve,reject)=>{
    reject(val)
});
}
//race方法 
Promise.race = function(promises){
return new Promise((resolve,reject)=>{
    promises.forEach((promise)=>{
    promise.then(resolve,reject)
    })
})
}
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises){
let arr = [];
let i = 0;
return new Promise((resolve,reject)=>{
    function processData(index,data){
        arr[index] = data;
        i++;
        if(i == promises.length){
            resolve(arr);
        };
        };
    promises.forEach((promise,i)=>{
    promise.then(data=>{
        processData(i,data);
    },reject);
    });
});
}
function resolvePromise(promise,x,resolve,reject){
if(x===promise){
    return reject(new TypeError("chain refrence"));
}
let called=false;
if(x!==null &&(typeof x==='object'||typeof x==='function')){
    try{
        let then=x.then;
        if(typeof then ==='function'){

            then.call(x,(y)=>{
                if(called)
                return;
                called=true;
                resolvePromise(promise,y,resolve,reject);
            },e=>{
                if(called)
                return;
                called=true;
                reject(e);
            })

        }else{
            resolve(x);
        }
    }catch(e){
        if(called)
        return;
        called=true;
        reject(e);
    }
}else{
    resolve(x);
}
}
Promise.defer = Promise.deferred = function () {
let dfd = {}
dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
});
return dfd;
}
module.exports = Promise;
  
  