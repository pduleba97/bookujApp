import { useState } from "react";
import "./ManageBusinesses.css";
import BusinessDetailsForm from "../../components/CreateBusiness/BusinessDetailsForm.jsx";
import BusinessAddressForm from "../../components/CreateBusiness/BusinessAddressForm.jsx";
import BusinessOpeningHoursForm from "../../components/CreateBusiness/BusinessOpeningHoursForm.jsx";
import BusinessServicesForm from "../../components/CreateBusiness/BusinessServicesForm.jsx";
import BusinessDescriptionForm from "../../components/CreateBusiness/BusinessDescriptionForm.jsx";
import { reduceImageSize } from "../../utils/imageUtils.js";
import { authFetch } from "../../api/authFetch.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function StepComponent({
  currentStep,
  businessData,
  setBusinessData,
  nextStep,
  prevStep,
  setBusinessPicture,
  handleBusinessSubmit,
}) {
  function handleOpeningHourSave(newOpeningHour, idx) {
    setBusinessData((prev) => {
      const newOpeningHours = [...prev.openingHours];
      newOpeningHours[idx] = newOpeningHour;
      return { ...prev, openingHours: newOpeningHours };
    });
  }

  switch (currentStep) {
    case 0:
      return (
        <BusinessDetailsForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          nextStep={nextStep}
          setBusinessPicture={setBusinessPicture}
        />
      );
    case 1:
      return (
        <BusinessAddressForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      );
    case 2:
      return (
        <BusinessDescriptionForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          nextStep={nextStep}
          prevStep={prevStep}
          setBusinessPicture={setBusinessPicture}
        />
      );
    case 3:
      return (
        <BusinessOpeningHoursForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          nextStep={nextStep}
          prevStep={prevStep}
          onSave={handleOpeningHourSave}
        />
      );
    case 4:
      return (
        <BusinessServicesForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          nextStep={nextStep}
          prevStep={prevStep}
          handleBusinessSubmit={handleBusinessSubmit}
        />
      );
    case 5:
      return null;
    default:
      return null;
  }
}

function CreateBusiness() {
  const initialOpeningHours = [
    { dayOfWeek: 1, isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Monday
    { dayOfWeek: 2, isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Tuesday
    { dayOfWeek: 3, isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Wednesday
    { dayOfWeek: 4, isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Thursday
    { dayOfWeek: 5, isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Friday
    { dayOfWeek: 6, isOpen: false, openTime: "10:00", closeTime: "18:00" }, // Saturday
    { dayOfWeek: 0, isOpen: false, openTime: "10:00", closeTime: "18:00" }, // Sunday
  ];

  const [businessData, setBusinessData] = useState({
    name: "",
    description: "",
    category: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    openingHours: initialOpeningHours,
    services: [],
  });
  const [businessPicture, setBusinessPicture] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  function nextStep() {
    setCurrentStep((prev) => prev + 1);
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }
  const navigate = useNavigate();

  async function handleBusinessSubmit() {
    // e.preventDefault(); //test

    const formData = new FormData();
    formData.append("json", JSON.stringify(businessData));

    if (businessPicture) {
      const reducedFile = await reduceImageSize(
        businessPicture,
        2000,
        2000,
        true,
      );

      formData.append("file", reducedFile);
    }

    try {
      const response = await authFetch("/businesses/me/", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      // console.log("Raw response:", text);
      if (!response.ok) {
        throw new Error(text);
      }

      const data = JSON.parse(text);
      toast.success("Successfully added new business!", {
        position: "top-center",
        style: { width: "60vw" },
      });
      navigate("/manage-businesses");
    } catch (err) {
      console.log("Fail");
      toast.error("Failed to add new business.", {
        position: "top-center",
        style: { width: "60vw" },
      });
      console.warn(err);
    }
  }

  return (
    <div className="create-business-wrapper">
      <StepComponent
        currentStep={currentStep}
        businessData={businessData}
        setBusinessData={setBusinessData}
        nextStep={nextStep}
        prevStep={prevStep}
        businessPicture={businessPicture}
        setBusinessPicture={setBusinessPicture}
        handleBusinessSubmit={handleBusinessSubmit} //test
      />
    </div>
  );
}

export default CreateBusiness;
