// src/components/PageComponent.tsx
import ReactMarkdown from 'react-markdown';

const PageComponent = ({ page }) => {
  return <ReactMarkdown>{page}</ReactMarkdown>;
};

export default PageComponent;
