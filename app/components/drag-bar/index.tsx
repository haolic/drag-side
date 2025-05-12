"use client";

import useStore from "@/app/store";

const DragBar = ({ compKey }: { compKey: string }) => {
  const setState = useStore.setState;
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // {"x":-456,"y":144,"width":720,"height":263.5,"top":144,"right":264,"bottom":407.5,"left":-456}
    // 获取点击位置
    const x = e.clientX;
    const y = e.clientY;

    localStorage.setItem(
      "modal-wrap-position" + compKey,
      JSON.stringify({
        x,
        y,
        width: 720,
        height: 263.5,
      })
    );

    setState({
      draggingCompKey: compKey,
    });
  };

  return (
    <div className="w-full border cursor-grab" onMouseDown={handleMouseDown}>
      drag
    </div>
  );
};

export default DragBar;
