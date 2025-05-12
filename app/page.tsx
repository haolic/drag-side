"use client";

import Options from "./components/options";
import useStore from "./store";
import ModalContent2 from "./components/dy-components/modal-content2";
import ModalContent from "./components/dy-components/modal-content";
import DragBar from "./components/drag-bar";

const compMap = {
  ModalContent,
  ModalContent2,
};

export default function Home() {
  const leftSideCompKey = useStore((state) => state.leftSideCompKey);
  const rightSideCompKey = useStore((state) => state.rightSideCompKey);

  console.log(leftSideCompKey, rightSideCompKey);

  return (
    <div className="h-dvh pb-10 flex flex-col bg-gray-300">
      <div className="flex flex-1">
        <div className="flex">
          {leftSideCompKey.map((key) => {
            const Comp = compMap[key as keyof typeof compMap];
            return (
              <div key={key} className="border-r">
                <DragBar compKey={key} />
                <Comp />
              </div>
            );
          })}
        </div>

        <div className="flex-1 flex justify-center items-center">内容</div>
        <div>
          {rightSideCompKey.map((key) => {
            const Comp = compMap[key as keyof typeof compMap];
            return (
              <div key={key}>
                <DragBar compKey={key} />
                <Comp />
              </div>
            );
          })}
        </div>
      </div>

      <Options />
    </div>
  );
}
