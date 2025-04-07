import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const paymentMethods = [
  "Оплата готівкою",
  "Оплата карткою клієнта",
  "Оплата через Приват24 (QR-код)",
  "Оплата банківською карткою",
];

const ItemType = "PAYMENT_METHOD";

const PaymentMethodItem = ({ text, index, moveItem }: any) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="flex items-center p-2 border rounded bg-white shadow-sm cursor-grab">
      <span className="mr-2 text-lg">☰</span>
      {text}
    </div>
  );
};

const PaymentMethodsList = () => {
  const [items, setItems] = useState(paymentMethods);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 items-start">
        <span className="text-gray-700">Порядок типів оплати в меню апарата</span>
        <div className="flex flex-col gap-2 border p-3 rounded">
          {items.map((text, index) => (
            <PaymentMethodItem key={index} text={text} index={index} moveItem={moveItem} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default PaymentMethodsList;
