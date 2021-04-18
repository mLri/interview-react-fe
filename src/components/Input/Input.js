import React, { useState, useEffect } from 'react'
import './Input.css'

function InputDemo({ type = 'text', name = '', placeholder = '', value = '', onFocus = false, autoComplete = "off", handleOnChangeFunc, handleOnClickFunc = () => null }) {

  const [input, setInput] = useState('')
  const [timeOut, setTimeOut] = useState(0)

  useEffect(() => {
    setInput(value)
    if (onFocus) document.querySelector('.input').focus()
  }, [value])

  const handleOnChange = (e) => {
    setInput(e.target.value)
    handleOnChangeFunc(e)
    // if (timeOut) clearTimeout(timeOut)
    // setTimeOut(setTimeout(() => { setInput('') }, 1000))
  }

  const handleOnClick = (e) => {
    console.log('click ...')
    handleOnClickFunc(e)
  }

  return (
    <div className="input__container">
      <input
        onClick={handleOnClick}
        onChange={handleOnChange}
        value={input}
        placeholder={placeholder}
        name={name}
        className="input"
        type={type}
        autoComplete={autoComplete} />
    </div>
  )
}

export default InputDemo
