import { useState } from "react";
import UserDetailsForm from "../../components/Register/UserDetailsForm";
import PersonalDetailsForm from "../../components/Register/PersonalDetailsForm";
import ConfirmForm from "../../components/Register/ConfirmForm";
import SuccessForm from "../../components/Register/SuccessForm";
import "./Register.css";

function Register() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [currentSection, setCurrentSection] = useState(0);

  function nextSection() {
    setCurrentSection((prev) => prev + 1);
  }

  function prevSection() {
    setCurrentSection((prev) => prev - 1);
  }

  return (
    <div className="register-card-wrapper">
      <div className="register-card">
        <div className="register-details">
          {currentSection !== 3 && (
            <>
              <h2>Create account</h2>
              <p id="register-description">
                Book appointments and manage your visits in one simple,
                convenient place. For free.
              </p>
            </>
          )}
          {(() => {
            switch (currentSection) {
              case 0:
                return (
                  <UserDetailsForm
                    nextSection={nextSection}
                    setUser={setUser}
                    user={user}
                  />
                );
              case 1:
                return (
                  <PersonalDetailsForm
                    nextSection={nextSection}
                    prevSection={prevSection}
                    setUser={setUser}
                    user={user}
                  />
                );
              case 2:
                return (
                  <ConfirmForm
                    nextSection={nextSection}
                    prevSection={prevSection}
                    user={user}
                  />
                );
              case 3:
                return <SuccessForm />;
            }
          })()}
        </div>
        <div className="register-graphic" />
      </div>
    </div>
  );
}

export default Register;
