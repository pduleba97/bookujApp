import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authFetch } from "../../../../api/authFetch";
import { useParams } from "react-router-dom";

function SortableEmployeeItem({
  se,
  selectedEmployee,
  setSelectedEmployee,
  setServiceFilter,
  fetchEmployeeServicesGroupedByCategory,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: se.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`business-staff-content-staff-list-single ${
          selectedEmployee.id === se.id ? "active" : ""
        }`}
        onClick={() => {
          setSelectedEmployee(se);
          fetchEmployeeServicesGroupedByCategory(se.id);
          setServiceFilter("");
        }}
      >
        {/* DRAG HANDLE */}
        <div style={{ padding: "1em 1em", cursor: "grab" }}>
          <FontAwesomeIcon
            icon={faBars}
            {...listeners}
            className="business-staff-content-staff-list-single-icon"
          />
        </div>
        {se.imageUrl ? (
          <img
            src={se.imageUrl}
            className="business-staff-content-staff-list-avatar"
          />
        ) : (
          <div className="business-staff-content-staff-list-avatar-placeholder">
            {(se.firstName?.[0].toUpperCase() || "") +
              (se.lastName?.[0].toUpperCase() || "")}
          </div>
        )}
        <div style={{ marginLeft: "1rem" }}>
          {se.firstName + " " + se.lastName}
        </div>
      </div>
      <hr className="divider" />
    </div>
  );
}

function BusinessEmployeesDnd({
  filteredStaffList,
  selectedEmployee,
  setSelectedEmployee,
  setStaffList,
  setServiceFilter,
  fetchEmployeeServicesGroupedByCategory,
}) {
  const { businessId } = useParams();

  async function handleChangeSortOrder(currentElementId, prevId, nextId) {
    var url;
    if (prevId != null && nextId != null)
      url = `/businesses/me/${businessId}/ReorderEmployee/${currentElementId}?prevId=${prevId}&nextId=${nextId}`;
    else if (prevId != null)
      url = `/businesses/me/${businessId}/ReorderEmployee/${currentElementId}?prevId=${prevId}`;
    else if (nextId != null)
      url = `/businesses/me/${businessId}/ReorderEmployee/${currentElementId}?nextId=${nextId}`;
    else
      url = `/businesses/me/${businessId}/ReorderEmployee/${currentElementId}`;

    try {
      const response = await authFetch(url, { method: "PUT" });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setStaffList((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);

          const newItems = arrayMove(items, oldIndex, newIndex);

          const prevId = newItems[newIndex - 1]?.id || null;
          const nextId = newItems[newIndex + 1]?.id || null;

          handleChangeSortOrder(active.id, prevId, nextId);

          return newItems;
        });
      }}
    >
      <SortableContext
        items={filteredStaffList.map((se) => se.id)}
        strategy={verticalListSortingStrategy}
      >
        {filteredStaffList.map((se) => (
          <SortableEmployeeItem
            key={se.id}
            se={se}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            setServiceFilter={setServiceFilter}
            fetchEmployeeServicesGroupedByCategory={
              fetchEmployeeServicesGroupedByCategory
            }
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default BusinessEmployeesDnd;
