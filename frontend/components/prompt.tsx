"use client"

import * as React from "react"
import { useState, ChangeEvent } from 'react';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function Prompt({onChange, setLoading, setData}: { onChange: (value: React.SetStateAction<number>) => void; setLoading: (value: boolean) => void; setData: (value: any) => void;}) {
    const [textareaValue, setTextareaValue] = useState('');
    const [disabled, setDisable] = useState(false);



    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(event.target.value);
    };

    const listener = (event : any)=> {
        if (event.key === 'Enter' && !event.shiftKey) {
            callAPI();
        }
    }

    const callAPI = async () => {
		try {
            setDisable(true)
            const check_mode = typeof window !== 'undefined' ? localStorage.getItem('mode') : null;
            const check_results = typeof window !== 'undefined' ? localStorage.getItem('results') : null;
            const tmp = check_mode || '2';
            onChange(Number(tmp));
            setLoading(true);
            console.log(textareaValue);
            const url = (tmp == '1') ? process.env.NEXT_PUBLIC_SEARCH_ENDPOINT : process.env.NEXT_PUBLIC_CHAT_ENDPOINT;
			await fetch(url ? url : '', {
                body: JSON.stringify({
                    "prompt" : textareaValue,
                    "results" : check_results || '5',
                    "temperature" : "0.4",
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST'
            })
            .then(async (res) => await res.json())
            .then(async (data) => {
                setData(data);
                setLoading(false);
                setDisable(false);
                console.log(data);
            });
        } catch (err) {
            setDisable(false);
            setLoading(false);
            console.log(err);
        }
	};

    return (
        <React.Fragment>
            <div className="flex justify-center items-center">
                <div className="flex flex-col gap-4 mt-7 w-full"> 
                    <Label htmlFor="prompt">Prompt:</Label>
                    <Textarea placeholder="Type your prompt here." id="prompt" disabled={disabled} value={textareaValue} onChange={handleTextareaChange} onKeyDown={(e) => listener(e)}/>
                    <Button onClick={callAPI}>Ask AWS GPT</Button>
                </div>
            </div>
        </React.Fragment>
    )
  }