"use client";
import useStore from "@/app/store";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

const DragModalWrap = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  const compKey = (children as unknown as { type: { name: string } })?.type
    ?.name;

  const setState = useStore.setState;

  const leftSideCompKey = useStore((state) => state.leftSideCompKey);
  const rightSideCompKey = useStore((state) => state.rightSideCompKey);
  const draggingCompKey = useStore((state) => state.draggingCompKey);

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDragging = draggingCompKey === compKey;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wrapRef.current) {
      document.body.style.userSelect = "none";
      const rect = wrapRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setState({
        draggingCompKey: compKey,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && wrapRef.current) {
        const x = e.clientX - dragOffsetRef.current.x;
        const y = e.clientY - dragOffsetRef.current.y;
        wrapRef.current.style.left = `${x}px`;
        wrapRef.current.style.top = `${y}px`;
        // 模态框位置：{ left: x, top: y }
        // 鼠标位置：{ x: e.clientX, y: e.clientY }

        if (e.clientX < 150) {
          if (!leftSideCompKey.includes(compKey)) {
            setState({
              leftSideCompKey: [...leftSideCompKey, compKey],
            });
          }
        } else if (e.clientX > window.innerWidth - 150) {
          if (!rightSideCompKey.includes(compKey)) {
            setState({
              rightSideCompKey: [...rightSideCompKey, compKey],
            });
          }
        } else {
          if (useStore.getState().leftSideCompKey.includes(compKey)) {
            setState({
              leftSideCompKey: leftSideCompKey.filter((key) => key !== compKey),
            });
          }
          if (useStore.getState().rightSideCompKey.includes(compKey)) {
            setState({
              rightSideCompKey: rightSideCompKey.filter(
                (key) => key !== compKey
              ),
            });
          }
        }
      }
    },
    [isDragging, leftSideCompKey, rightSideCompKey, compKey, setState]
  );

  const handleMouseUp = useCallback(() => {
    document.body.style.userSelect = "auto";
    setState({
      draggingCompKey: "",
    });

    localStorage.setItem(
      "modal-wrap-position" + compKey,
      JSON.stringify(wrapRef.current?.getBoundingClientRect())
    );
  }, [compKey, setState]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const button = (
    <button
      onClick={() => setIsOpen(true)}
      className="bg-white cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
    >
      点击
    </button>
  );

  if (!isOpen) return button;
  if (
    !isDragging &&
    (leftSideCompKey.includes(compKey) || rightSideCompKey.includes(compKey))
  ) {
    return button;
  }

  const defaultPosition = localStorage.getItem("modal-wrap-position" + compKey);

  let position = { left: 0, top: 0 };

  try {
    position = JSON.parse(defaultPosition as string);
  } catch (error) {
    console.error(error);
  }

  const portal = createPortal(
    <div
      ref={wrapRef}
      className={cn(
        "fixed z-50 w-1/2 h-1/2 border bg-white transition-opacity rounded-2xl overflow-hidden shadow-lg",
        {
          "opacity-50": isDragging,
        }
      )}
      style={{
        left: position?.left,
        top: position?.top,
        transform: "none",
      }}
    >
      <div
        className="cursor-grab border-b p-2 bg-gray-50 text-right"
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="bg-white cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
        >
          关闭
        </button>
      </div>

      <div className="p-4">{children}</div>
    </div>,
    document.body
  );
  return (
    <>
      {button}
      {portal}
    </>
  );
};

export default DragModalWrap;
