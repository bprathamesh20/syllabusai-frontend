import React, { useRef, useState } from 'react'
import NotesIcon from './NotesIcon'
import TestIcon from './TestIcon'
import LoadingBar from './LoadingBar'
import '../content.css'
import { useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';


export default function AnalysePlayground() {
    const [syllabusInput, setSyllabusInput] = useState('')
    const [content, setContent] = useState('input syllabus to display content')
    const [isLoading, setisLoading] = useState(false)
    const { user } = useUser()


    const handleAnalyseRequest = () => {
        setisLoading(true)
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "syllabus": `${syllabusInput}`,
            "user_id": `${user.id}`
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://syllabus-ai.onrender.com/analyse", requestOptions)
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                const content = data.data; // Extract content from the "data" field
                console.log(content);
                setContent(content); // Set the content value to the variable
                setisLoading(false)
   
            })
            .catch(error => console.log('error', error));



    }


    const handleSyllabusChange = (e) => {
        const inputValue = e.target.value;

        // Truncate the input to the maximum length (280 characters)
        const truncatedValue = inputValue.slice(0, 500);

        // Update the state with the truncated value
        setSyllabusInput(truncatedValue);
    };




    return (
        <div className='flex flex-col items-center  lg:w-4/12   p-3 w-full'>
            <div className='flex flex-col w-full gap-4'>


                <h2 className="text-2xl font-bold leading-7  sm:truncate sm:text-3xl sm:tracking-tight">
                    Analyse syllabus
                </h2>
                <textarea
                    className="textarea textarea-bordered"
                    placeholder="Add your syllabus here"
                    onChange={handleSyllabusChange}
                    value={syllabusInput}
                />
                <p>{`${syllabusInput.length}/500 characters`}</p>

                <div className='flex flex-row items-center gap-2 w-full'>

                 
                    <button className="btn btn-active"
                        onClick={handleAnalyseRequest}>
                        <TestIcon />
                        Analyse Syllabus
                    </button>


                </div>

                <div className='flex items-center justify-center w-full  p-6 border-slate-700 border rounded-md'>


                    {isLoading ? <LoadingBar /> : <div className='flex flex-col gap-2 content'><ReactMarkdown>{content}</ReactMarkdown></div>}


                </div>

            
                 
                


            </div>
        </div>

    )
}