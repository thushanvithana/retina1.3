import React from "react";
import { Button, StyleSheet, Text, View, ScrollView } from "react-native";

export default function DiabaticResult({ route, navigation }) {
  const { prediction, responseData } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Text style={styles.heading}>Diabatic Prediction Result</Text>
      <Text style={styles.predictionText}>
        Prediction: {prediction === 1 ? "Diabetic" : "Not Diabetic"}
      </Text>
      {responseData && (
        <View style={styles.responseDataContainer}>
          <Text style={styles.subheading}>Detailed Information:</Text>
          {Object.entries(responseData).map(([key, value]) => (
            <Text key={key} style={styles.dataItem}>
              {key}: {JSON.stringify(value)}
            </Text>
          ))}
        </View>
      )}

      <Button
        title="if positive go to retinopathy page"
        onPress={() => navigation.navigate("Retinopathy")}
      />

      <Button
        title="if negative go to healthy tips page "
        onPress={() => navigation.navigate("Locations")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
