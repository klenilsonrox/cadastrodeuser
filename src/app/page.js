"use client"
import React, { useRef, useState } from 'react'
import axios from "axios"



const page = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [dados,setDados]=React.useState([])
    const [loading,setLoading]=React.useState(false)
    const [sucess,setSucess]=React.useState(false)
    const [erro,setErro]=React.useState(false)
    const [modal,setModal]=React.useState(false)
    const refSucess = useRef()
    const refErro = useRef()

    const handleSubmit = async (event) => {

        clearTimeout(refSucess.current)
        event.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);

            // URL da sua API backend
            const url = 'https://apimages.onrender.com/users';

            // Faça uma solicitação POST para enviar os dados
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false)
            // Verifique a resposta da solicitação
            setName("")
            setFile("")
            console.log('Dados enviados com sucesso:', response.data);
            setSucess(response.data.message)

            refSucess.current = setTimeout(()=>{
                setSucess("")
            },2000)

            setModal(false)

        } catch (error) {
            // Em caso de erro, exiba uma mensagem de erro
            console.error('Erro ao enviar dados:', error);
        }
        buscarusers()
    };

    async function buscarusers(){
        const response = await axios.get("https://apimages.onrender.com/users")
  
        setDados(response)
    }

    React.useEffect(()=>{
        buscarusers()
    },[])

    async function deletarItem(id){
        clearTimeout(refErro.current)
        setErro("deletando usuario")
        const item = await axios.delete(`https://apimages.onrender.com/users/${id}`)
        buscarusers()
        refErro.current= setTimeout(()=>{
            setErro("")
        },1500)
    }


    function closeModal(e){
        if(e.target.id==="modal"){
            setModal(false)
        }
    }


    return (
        <div className='max-w-7xl mx-auto p-4'>

            {modal && <div className='flex fixed inset-0 bg-black bg-opacity-60 items-center backdrop-blur-sm justify-center' id='modal' onClick={closeModal}>
            <form onSubmit={handleSubmit} className='flex flex-col max-w-sm border p-4 rounded-md bg-white'>
                <label htmlFor="name">Nome:</label>
                <input
                    type="text"
                    id="name"
                    className='border-2 bg-gray-100 rounded-md py-2'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /><br/><br/>
                <label htmlFor="file">Arquivo:</label>
                <input
                    type="file"
                    id="file"
            
                    onChange={(e) => setFile(e.target.files[0])}
                /><br/><br/>
                <div className='flex gap-4'>
                <button type="submit" className='bg-blue-600 text-white px-6 py-2 rounded-md'>Cadastrar</button>
                <button className='border py-2 px-6 rounded-md' onClick={()=>setModal(false)}>Voltar</button>
                </div>
            </form>
            </div>}

            {sucess && <div className='flex fixed inset-0 justify-center z-50'>
                <p className='bg-green-600 max-h-[35px] flex items-center justify-center text-white py-2 px-6 rounded-md mt-2'>{sucess}</p>
            </div>}

            {erro && <div className='flex fixed inset-0 justify-center z-50'>
                <p className='bg-red-600 max-h-[35px] flex items-center justify-center text-white py-2 px-6 rounded-md mt-2'>{erro}</p>
            </div>}

{loading && <div className='fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex items-center justify-center'>
    <div className='w-12 h-12 rounded-full border-blue-600 animate-spin border-2 border-r-transparent'></div>
</div>}

            <div className='mt-10 max-w-7xl'>
            <header className='py-6'>
                <button className='bg-blue-600 px-6 py-2 rounded-md text-white' onClick={()=>setModal(true)}>Cadastrar usuário</button>
            </header>
                <h1 className='text-xl font-bold'>usuarios</h1>
                <div className='flex gap-4 flex-wrap'>
                    {dados.data && dados.data.map((item)=> (
                        <div className='border rounded-md p-4 flex items-center justify-center flex-col' key={item._id}>
                            <img src={item.urlImage} alt="" className='w-screen h-screen max-w-[100px] max-h-[100px] rounded-full object-cover'/>
                            <h1 className='font-bold'>{item.name}</h1>
                            <button className='bg-red-600 text-white px-5 py-2 rounded-md mt-4' onClick={()=>deletarItem(item._id)}>deletar</button>
                        </div>
                    ) )}
                </div>
            </div>
        </div>
    );
};
export default page
