import React,{ useState, useEffect } from 'react'

function Test() {

  const [test, setTest] = useState([])

  useEffect(() => {
    run()
    console.log(test)
  }, [])

  const run = () => {
    const a = [1, 2, 3]
    setTest(a)
  }
  return (
    <div>
      {console.log(test)}
      {test.map(t => (
        <p>{t}</p>
      ))}
    </div>
  )
}

export default Test
