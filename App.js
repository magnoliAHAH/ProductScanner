import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";


import "react-native-gesture-handler";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet"
import { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function App() {

  const bottomSheetModalRef = useRef(null);
  
  const snapPoints = ["25%", "90%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [scanType, setScanType] = useState(null);
  const [scanData, setScanData] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanType(type);
    setScanData(data);
    setScanned(true);
    handlePresentModal();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>

        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
          >
            <View style={{borderWidth: 1, borderColor: "green", flexDirection: 'row', marginTop: 20, marginHorizontal: 10,}}>

              <View style={{borderWidth: 1, borderColor: "blue", margin: 3,}}>
                <Text>Изображение</Text>
              </View>

              <View style={{borderWidth: 1, borderColor: "yellow", flex: 1,}}>
                <View style={{borderWidth: 1, borderColor: "orange"}}>
                  <Text>Название продукта{'\n'} {scanData} </Text>
                </View>
                <View style={{borderWidth: 1, borderColor: "grey"}}>
                  <Text>Тип продукта</Text>
                </View>
                <View style={{borderWidth: 1, borderColor: "red"}}>
                  <Text style={{color: 'red'}}>Оценка</Text>
                </View>
              </View>

              {/* {scanType && scanData ? (
                <Text>Тип: {scanType}, Данные: {scanData}</Text>
              ) : (
                <Text>Данные не получены</Text>
              )} */}
            </View>
            
          </BottomSheetModal>

          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "codabar", "aztec", "code128", "code39" , "code93", "datamatrix", "ean13", "ean8", "itf14", "upc_a", "upc_e"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
          )}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});