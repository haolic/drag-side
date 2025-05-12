"use client";
import DragModalWrap from "../drag-modal-wrap";
import ModalContent from "../dy-components/modal-content";
import ModalContent2 from "../dy-components/modal-content2";
const Options = () => {
  return (
    <div className="h-10 border-t overflow-hidden fixed bottom-0 w-full text-xs flex justify-center items-center">
      <DragModalWrap>
        <ModalContent />
      </DragModalWrap>

      <DragModalWrap>
        <ModalContent2 />
      </DragModalWrap>
    </div>
  );
};

export default Options;
