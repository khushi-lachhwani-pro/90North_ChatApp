import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export default function FormTextField(props: TextInputProps) {
  const { style } = props;

  return (
    <TextInput
      style={[styles.container, style]} 
      cursorColor={'gray'} 
      selectionColor={'black'} 
      selectionHandleColor={'black'} 
      {...props}      
    />
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 0.3,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',    
    borderColor: 'black',
    paddingLeft: 10    
  }
})