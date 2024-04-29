export default ({title,description,keywords})=>{
    const addMeta = (name,content)=>{
        const head = document.getElementsByTagName('head')[0];
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        head.appendChild(meta);
    }

    document.title = title;
    if(document.getElementsByName('description')[0]){
        document.getElementsByName('description')[0].content = description;
    }else{
        addMeta("description",description);
    }
    if(document.getElementsByName('keywords')[0]){
        document.getElementsByName('keywords')[0].content = keywords;
    }else{
        addMeta("keywords",keywords);
    }
}