import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BusinessStaffWeeklySchedule.css";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../../api/authFetch";
import Spinner from "../../../../../utils/Spinner/Spinner";

function BusinessStaffWeeklySchedule({ businessId, employeeId }) {
  const [selectedEmployeeWeeklySchedules, setSelectedEmployeeWeeklySchedules] =
    useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchEmployeeWeeklySchedule() {
    setIsLoading(true);
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/employees/${employeeId}/weekly-schedule`,
        {
          method: "GET",
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSelectedEmployeeWeeklySchedules(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployeeWeeklySchedule();
  }, [businessId, employeeId]);

  function getTimeDifference(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startMinutesTotal = startHours * 60 + startMinutes;
    const endMinutesTotal = endHours * 60 + endMinutes;

    return (endMinutesTotal - startMinutesTotal) / 60 + "h";
  }

  return (
    <div className="business-staff-weekly-schedule-wrapper">
      {isLoading ? (
        <Spinner />
      ) : (
        selectedEmployeeWeeklySchedules.map((day) => (
          <div key={day.id} className="business-staff-weekly-schedule-row">
            <div style={{ fontWeight: "bold" }}>{day.dayOfWeek}</div>
            <div>
              {day.isWorking
                ? day.startTime.substring(0, 5) +
                  " - " +
                  day.endTime.substring(0, 5)
                : "Doesn't work"}
            </div>
            <div className="business-staff-weekly-schedule-row-duration">
              <FontAwesomeIcon
                className="business-staff-weekly-schedule-row-duration-icon"
                icon={faClock}
              />{" "}
              {day.isWorking
                ? getTimeDifference(day.startTime, day.endTime)
                : "-"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BusinessStaffWeeklySchedule;
