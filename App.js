import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { convertToRoman } from './src/utils';
export default function App() {

  const [input, setInput] = useState('')
  const [currentInput, setCurrentInput] = useState('')
  const [totalVal, settotalVal] = useState('')
  const [prev, setPrev] = useState(null)
  const [operation, setOperation] = useState(null)
  const [calcdone, setCalcDone] = useState(false)
  const [numeric, setNumeric] = useState(true)
  const [arrInput, setArrInput] = useState([])

  const convertLabel = label => {
    let strlabel = label
    if (!numeric) {
      return convertToRoman(label)
    }
    return strlabel
  }

  const renderArrInput = () => {
    if (arrInput.length == 0) return ''
    let str = ''
    arrInput.forEach(i => {
      str += convertLabel(i)
    })
    return str
  }

  const keypadInput = val => {
    const str = String(val)
    if (calcdone) {
      clearCalc()
      setCurrentInput(str)
      return
    }
    if (currentInput) {
      setCurrentInput(currentInput + str)
    } else {
      setCurrentInput(str)
    }
  }

  const keypadOperation = op => {
    const strop = String(op)
    let localArr = arrInput
    console.log('@@@@ OPERATION', strop, op)
    setOperation(strop)


    if (!prev) setPrev(currentInput)

    if (calcdone) {
      localArr = []
      setCurrentInput(null)
      setInput(totalVal + strop)
      localArr.push(totalVal)
      localArr.push(strop)
      setArrInput(localArr)
      setCalcDone(false)
      return
    }

    if (currentInput) {
      setInput(input + currentInput + strop)
      localArr.push(currentInput)
      localArr.push(strop)
      setArrInput(localArr)
      calculate()
    }
  }

  const calculate = (final = false) => {
    let prevInt = parseInt(prev)
    let currInt = parseInt(currentInput)
    var calc = 0

    if (operation == "+") {
      calc = prevInt + currInt
      settotalVal(calc)
      setPrev(calc)
    }

    if (operation == "-") {
      calc = prevInt - currInt
      if (calc < 0) calc = 0 //ABSOLUTE VALUE TO 0 
      settotalVal(calc)
      setPrev(calc)
    }

    if (operation == "X") {
      calc = prevInt * currInt
      settotalVal(calc)
      setPrev(calc)
    }

    if (operation == "/") {
      calc = prevInt / currInt
      settotalVal(calc)
      setPrev(calc)
    }
    if (final) {
      equals(calc)
    } else {
      setCurrentInput(null)
    }
  }

  const equals = (val) => {
    let localArr = arrInput
    setCurrentInput(val)
    setInput(input + currentInput)
    localArr.push(currentInput)
    setCalcDone(true)
  }


  const renderButton = label => {
    return (
      <TouchableOpacity key={label} onPress={() => keypadInput(label)} style={styles.button}>
        <Text style={{ fontSize: 24, color: 'white' }}>{convertLabel(label)}</Text>
      </TouchableOpacity>
    )
  }

  const onPressEquals = () => {
    if (calcdone) {
      clearCalc()
      return
    }
    if (currentInput) {
      calculate(true)
    } else {
      setCurrentInput(totalVal)
      let localArr = arrInput
      setInput(input)
      localArr.push(currentInput)
      setCalcDone(true)
    }
  }

  const renderOpButton = label => {
    return (
      <TouchableOpacity key={label} onPress={() => {
        if (label === '=') {
          onPressEquals()
        } else {
          keypadOperation(label)
        }
      }
      } style={{ ...styles.button, backgroundColor: label === '=' ? 'gray' : 'orange' }} >
        <Text style={{ fontSize: 24, color: 'white' }}>{label}</Text>
      </TouchableOpacity >
    )
  }

  const clearButton = () => {
    return (
      <TouchableOpacity onPress={() => clearCalc()} style={styles.button}>
        <Text style={{ fontSize: 24, color: 'black' }}>{"C"}</Text>
      </TouchableOpacity>
    )
  }

  const clearCalc = () => {
    setInput("")
    setCurrentInput("")
    setOperation(null)
    setPrev(null)
    setCalcDone(false)
    setArrInput([])
  }

  return (
    <View style={styles.container}>
      <Text style={{
        fontSize: 32,
        width: '68%',
        color: 'gray',
        textAlign: 'right',
      }}>{numeric ? input : renderArrInput()}</Text>
      <Text style={{
        fontSize: 32, width: '68%',
        marginVertical: 8,
        textAlign: 'right',
        borderRadius: 5,
        borderColor: 'gray',
        padding: 4,
        borderWidth: 1,
      }}>{convertLabel(currentInput) || 0}</Text>
      <View style={{ flexDirection: 'row', width: '70%', flexWrap: 1, justifyContent: 'center' }}>
        {renderButton(7)}
        {renderButton(8)}
        {renderButton(9)}
        {renderOpButton("+")}
        {renderButton(4)}
        {renderButton(5)}
        {renderButton(6)}
        {renderOpButton("-")}
        {renderButton(1)}
        {renderButton(2)}
        {renderButton(3)}
        {renderOpButton("X")}
      </View>
      <View style={{ flexDirection: 'row', width: '70%', flexWrap: 1, justifyContent: 'center' }}>
        {renderButton(0)}
        {clearButton()}
        {renderOpButton('=')}
        {renderOpButton("/")}
      </View>
      <TouchableOpacity onPress={() => setNumeric(!numeric)} style={{ ...styles.button, width: '60%' }}>
        <Text style={{ fontSize: 24, color: 'white' }}>{numeric ? 'Arabic Numeric' : 'Roman Numerals'}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderColor: 'black',
    backgroundColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 4,
    height: 60,
    width: 60,
  }
});
