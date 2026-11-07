(function(){
  var q=[];
  var busy=false;
  var current='';
  var shown=[];
  function el(){
    var node=document.getElementById('toast');
    if(node) return node;
    node=document.createElement('div');
    node.id='toast';
    node.className='igs-toast-queue';
    document.body.appendChild(node);
    return node;
  }
  function pump(){
    if(busy) return;
    var item=q.shift();
    if(!item){ current=''; return; }
    busy=true;
    current=item.msg;
    var node=el();
    node.textContent=item.msg;
    node.style.borderColor=item.color||'#4af';
    node.style.color=item.color||'#fff';
    node.style.opacity='1';
    setTimeout(function(){
      node.style.opacity='0';
      busy=false;
      current='';
      pump();
    }, 1500);
  }
  window.showToast=function(msg, color){
    if(!msg) return;
    var now=Date.now();
    shown=shown.filter(function(t){ return now-t<1000; });
    if(shown.length>=2) return;
    if(current===msg) return;
    if(q.length && q[q.length-1].msg===msg) return;
    q.push({msg:msg, color:color||''});
    shown.push(now);
    pump();
  };
  window._toastQueueState=function(){ return {q:q.length, busy:busy, current:current, shown:shown.length}; };
})();
