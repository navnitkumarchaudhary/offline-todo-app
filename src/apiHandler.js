import axios from "axios"

export const getAllTodo = async() =>{
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos")
    return res
}
export const updateTodo = async(data,id) =>{
    const res = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, data)
    return res
}

export const createTodo = async(data)=>{
    const res = await axios.post(`https://jsonplaceholder.typicode.com/todos/`, data)
    return res
}

export const deleteTodo = async(id)=>{
    const res = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    return res
}