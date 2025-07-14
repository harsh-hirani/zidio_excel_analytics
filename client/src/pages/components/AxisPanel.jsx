import React, { useState, useEffect } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  DragOverlay,
  TouchSensor,
} from '@dnd-kit/core';

// Convert index to Excel-style labels: X, Y, Z, AA, AB...
const getAxisLabel = (index) => {
  switch (index) {
    case 0:
      return 'X' 
    case 1:
      return 'Y'
    default:return 'Z'
  }
};

// Tile component (draggable)
const Tile = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="px-4 py-2 bg-white rounded shadow text-center m-1 min-w-[100px] max-w-[140px] break-words cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {id}
    </div>
  );
};

// DropZone (droppable area)
const DropZone = ({ id, label, tiles, size = 6 }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded border-2 col-span-${size} col-start-${(1+size)} border-dashed min-w-[100px] w-full min-h-[100px] flex flex-col items-center flex-shrink-0 ${isOver ? 'bg-cyan-100 border-cyan-400' : 'bg-slate-100 border-slate-300'
        }`}
    >
      <strong>{label}</strong>
      <div className="mt-2 flex flex-wrap justify-center">
        {(tiles || []).map((tile) => (
          <Tile key={tile} id={tile} />
        ))}
      </div>
    </div>
  );
};

// Main component
const AxisPanel = ({ labels, onUpdate, axisCount = 2 }) => {

  // const sensors = useSensors(useSensor(PointerSensor));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const [activeId, setActiveId] = useState(null);
  const size = 12 / axisCount
  const axisIds = Array.from({ length: axisCount }, (_, i) => getAxisLabel(i));



  const [state, setState] = useState({});

  useEffect(() => {
    onUpdate?.(state);
  }, [state]);

  useEffect(() => {
    const axisIds = Array.from({ length: axisCount }, (_, i) => getAxisLabel(i));

    // Create new state based on existing data, preserving current tiles if possible
    setState({
      available: labels,
      ...Object.fromEntries(axisIds.map((label) => [label, []])),
    });
  }, [axisCount]);

  const findZone = (tileId) =>
    Object.keys(state).find((zone) => state[zone].includes(tileId));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const from = findZone(active.id);
    const to = over.id;
    if (!from || !to) return;

    setState((prev) => {
      const newState = { ...prev };
      newState[from] = newState[from].filter((t) => t !== active.id);
      if (!newState[to].includes(active.id)) {
        newState[to] = [...newState[to], active.id];
      }
      return newState;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid w-full gap-6 p-4 grid-cols-12">
        {/* Row 1: Label pool */}
        <div className="flex flex-wrap gap-2 col-span-12" >
          <DropZone id="available" label="Available Fields" tiles={state.available} size={12} />
        </div>

        {/* Row 2: Scrollable Axis DropZones */}
        <div className=" gap-4 overflow-x-auto pb-2 col-span-12 ">
          <div className="grid grid-cols-12">

            {axisIds.map((axisId) => (
              <DropZone
                size={size}
                key={axisId}
                id={axisId}
                label={axisId + " Axis"}
                tiles={state[axisId]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating drag tile */}
      <DragOverlay>
        {activeId && (
          <div className="px-4 py-2 bg-white rounded shadow text-center min-w-[100px]">
            {activeId}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default AxisPanel;
