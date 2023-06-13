"use client"

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TwoToggle } from "@/components/two-toggle"
 
export function Settings() {
  const check_mode = typeof window !== 'undefined' ? localStorage.getItem('mode') : null;
  const check_results = typeof window !== 'undefined' ? localStorage.getItem('results') : null;
  const [mode, setMode] = useState(check_mode || '2');
  const [results, setResults] = useState(check_results || '5');

  const handleSaveChanges = () => {
    console.log(mode, results)
    if (Number(results) < 1 || isNaN(Number(results))) {
      setResults(String(1));
      localStorage.setItem('mode', mode);
      localStorage.setItem('results', '1');
    }else if (Number(results) > 10) {
      setResults(String(10));
      localStorage.setItem('mode', mode);
      localStorage.setItem('results', '10');
    }else {
      localStorage.setItem('mode', mode);
      localStorage.setItem('results', results);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your settings here. Add your OpenAI API key, mode, and result count. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mode" className="text-right">
            Mode
            </Label>
            <TwoToggle value={mode} onChange={setMode} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="results" className="text-right">
              Results
            </Label>
            <Input
              id="results"
              className="col-span-3"
              min={1}
              max={10}
              onChange={(e) => setResults(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}