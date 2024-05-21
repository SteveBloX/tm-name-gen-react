import React from "react";

export default function TextWithIcon({
  text,
  icon,
  reverse,
}: {
  text: string;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  if (reverse) {
    return (
      <span className="flex items-center">
        <span className="mr-2">{text}</span>
        {icon}
      </span>
    );
  }
  return (
    <span className="flex items-center">
      {icon}
      <span className="ml-2">{text}</span>
    </span>
  );
}
