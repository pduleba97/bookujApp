import {
  DndContext,
  useSensors,
  useSensor,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authFetch } from "../../../../api/authFetch";
import { useParams } from "react-router-dom";

function SortableCategoryItem({
  sc,
  selectedCategoryId,
  setSelectedCategoryId,
  setShowEditServiceCategoryModalId,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`dashboard-settings-services-body-categories-category ${
        selectedCategoryId === sc.id
          ? "dashboard-settings-services-body-categories-category-selected"
          : ""
      }`}
      onClick={() => setSelectedCategoryId(sc.id)}
    >
      {/* DRAG HANDLE */}
      <div
        className="dashboard-settings-services-body-categories-category-grab"
        {...listeners}
      >
        <FontAwesomeIcon icon={faBars} />
      </div>

      <p>{sc.name}</p>

      <div
        className="dashboard-settings-services-body-categories-category-chevron"
        onClick={(e) => {
          e.stopPropagation();
          setShowEditServiceCategoryModalId(sc.id);
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
}

function BusinessCategoriesDnd({
  serviceCategories,
  setServiceCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  setShowEditServiceCategoryModalId,
}) {
  const { businessId } = useParams();

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  async function handleChangeSortOrder(currentElementId, prevId, nextId) {
    var url;
    if (prevId != null && nextId != null)
      url = `/businesses/me/${businessId}/ReorderCategory/${currentElementId}?prevId=${prevId}&nextId=${nextId}`;
    else if (prevId != null)
      url = `/businesses/me/${businessId}/ReorderCategory/${currentElementId}?prevId=${prevId}`;
    else if (nextId != null)
      url = `/businesses/me/${businessId}/ReorderCategory/${currentElementId}?nextId=${nextId}`;
    else
      url = `/businesses/me/${businessId}/ReorderCategory/${currentElementId}`;

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
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setServiceCategories((items) => {
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
        items={serviceCategories.map((sc) => sc.id)}
        strategy={verticalListSortingStrategy}
      >
        {serviceCategories.map((sc) => (
          <SortableCategoryItem
            key={sc.id}
            sc={sc}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            setShowEditServiceCategoryModalId={
              setShowEditServiceCategoryModalId
            }
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default BusinessCategoriesDnd;
