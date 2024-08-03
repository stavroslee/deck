// src/components/SlideComponent.tsx
const SlideComponent = ({ slide }) => {
  return (
    <div>
      {slide.pages.map((page, index) => (
        <PageComponent key={index} page={page} />
      ))}
    </div>
  );
};

export default SlideComponent;
