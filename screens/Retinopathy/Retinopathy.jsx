import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
export default function Retinopathy() {
  const navigation = useNavigation();
  const [gender, setGender] = useState("");
  const [diabetesType, setDiabetesType] = useState("Type 2");
  const [systolicBP, setSystolicBP] = useState("");
  const [diastolicBP, setDiastolicBP] = useState("");
  const [hbA1c, setHbA1c] = useState("");
  const [avgGlucose, setAvgGlucose] = useState("");
  const [diagnosisYear, setDiagnosisYear] = useState("");
  const [prediction, setPrediction] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    "Diabetes Type": ["Type 2"],
  });

  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      performOCR(result.assets[0]);
      setImage(result.assets[0].uri);
    }
  };

  const pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      performOCR(result.assets[0]);
      setImage(result.assets[0].uri);
    }
  };

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    validateForm();
  }, [gender, systolicBP, diastolicBP, hbA1c, avgGlucose, diagnosisYear]);

  const validateForm = () => {
    let errors = {};

    if (!gender) {
      errors.gender = "Gender is required.";
    }

    if (!systolicBP) {
      errors.systolicBP = "Systolic BP is required.";
    } else if (isNaN(systolicBP) || systolicBP <= 0) {
      errors.systolicBP = "Systolic BP must be a positive number.";
    }

    if (!diastolicBP) {
      errors.diastolicBP = "Diastolic BP is required.";
    } else if (isNaN(diastolicBP) || diastolicBP <= 0) {
      errors.diastolicBP = "Diastolic BP must be a positive number.";
    }

    if (!hbA1c) {
      errors.hbA1c = "HbA1c is required.";
    } else if (isNaN(hbA1c) || hbA1c <= 0) {
      errors.hbA1c = "HbA1c must be a positive number.";
    }

    if (!avgGlucose) {
      errors.avgGlucose = "Estimated Avg Glucose is required.";
    } else if (isNaN(avgGlucose) || avgGlucose <= 0) {
      errors.avgGlucose = "Estimated Avg Glucose must be a positive number.";
    }

    if (!diagnosisYear) {
      errors.diagnosisYear = "Diagnosis Year is required.";
    } else if (
      isNaN(diagnosisYear) ||
      diagnosisYear < 1900 ||
      diagnosisYear > new Date().getFullYear()
    ) {
      errors.diagnosisYear = "Diagnosis Year must be a valid year.";
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handlePrediction = async () => {
    if (!isFormValid) {
      Alert.alert("Form Error", "Please correct the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const formData = {
        Gender: [gender],
        "Diabetes Type": [diabetesType],
        "Systolic BP": [parseFloat(systolicBP)],
        "Diastolic BP": [parseFloat(diastolicBP)],
        "HbA1c (mmol/mol)": [parseFloat(hbA1c)],
        "Estimated Avg Glucose (mg/dL)": [parseFloat(avgGlucose)],
        "Diagnosis Year": [parseInt(diagnosisYear)],
      };

      const response = await axios.post(
        "http://192.168.8.159:5000/predict-retinopathy",
        { data: formData }
      );

      setPrediction(response.data.prediction.toString());
      navigation.navigate("RetinopathyResult", {
        prediction: response.data.prediction,
        responseData: formData,
      });
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error occurred while predicting retinopathy");
      Alert.alert("Error", "An error occurred while predicting retinopathy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ScrollView>
        <View style={styles.container}>
          {/* Image Picker UI */}
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImageGallery}
          >
            <View style={styles.imagePlaceholder}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.imagePickerText}>
                  <FontAwesome name="photo" size={24} color="#ccc" /> Select
                  file
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={pickImageCamera}
          >
            <Text style={styles.cameraButtonText}>
              <FontAwesome name="camera" size={20} color="007BFF" /> Open Camera
              & Take Photo
            </Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  value={gender}
                  onChangeText={setGender}
                />
                {errors.gender && (
                  <Text style={styles.error}>{errors.gender}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Diabetes Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Diabetes Type"
                  value={diabetesType}
                  onChangeText={setDiabetesType}
                  editable={false} // Make it non-editable
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Systolic BP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Systolic BP"
                  value={systolicBP}
                  onChangeText={setSystolicBP}
                  keyboardType="numeric"
                />
                {errors.systolicBP && (
                  <Text style={styles.error}>{errors.systolicBP}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Diastolic BP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Diastolic BP"
                  value={diastolicBP}
                  onChangeText={setDiastolicBP}
                  keyboardType="numeric"
                />
                {errors.diastolicBP && (
                  <Text style={styles.error}>{errors.diastolicBP}</Text>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>HbA1c (mmol/mol)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HbA1c (mmol/mol)"
                  value={hbA1c}
                  onChangeText={setHbA1c}
                  keyboardType="numeric"
                />
                {errors.hbA1c && (
                  <Text style={styles.error}>{errors.hbA1c}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estimated Avg Glucose (mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Glucose"
                  value={avgGlucose}
                  onChangeText={setAvgGlucose}
                  keyboardType="numeric"
                />
                {errors.avgGlucose && (
                  <Text style={styles.error}>{errors.avgGlucose}</Text>
                )}
              </View>
            </View>

            <View>
              <Text style={styles.label}>Diagnosis Year</Text>
              <TextInput
                style={styles.input}
                placeholder="Diagnosis Year"
                value={diagnosisYear}
                onChangeText={setDiagnosisYear}
                keyboardType="numeric"
              />
              {errors.diagnosisYear && (
                <Text style={styles.error}>{errors.diagnosisYear}</Text>
              )}
            </View>
          </View>

          {loading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          )}

          <TouchableOpacity
            style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
            disabled={!isFormValid}
            onPress={handlePrediction}
          >
            <Text style={styles.buttonText}>Predict Diabetic Retinopathy</Text>
          </TouchableOpacity>

          <View style={styles.predictionContainer}>
            <Text style={styles.predictionText}>Prediction: {prediction}</Text>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  imagePicker: {
    width: "80%",
    height: 150,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#999",
  },
  orText: {
    fontSize: 16,
    color: "#999",
    marginVertical: 10,
  },
  cameraButton: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    marginBottom: 20,
  },
  cameraButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  predictionContainer: {
    marginTop: 20,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
