export default function GradientUsername({
  username,
  gradient,
  className,
}: {
  username: string;
  gradient: string[];
  className?: string;
}) {
  return (
    <span className={"font-bold" + className}>
      {gradient.map((color, i) => (
        <span style={{ color }} key={i}>
          {username[i]}
        </span>
      ))}
    </span>
  );
}
