import { useParams, Navigate } from "react-router-dom";
import { PolicyLayout } from "@/components/PolicyLayout";
import { SEO } from "@/components/SEO";
import { LEGAL_DOCS, EFFECTIVE_DATE } from "@/data/legalDocs";

// Renders any doc registered in LEGAL_DOCS by id - bullet lines ("• ...")
// group into a <ul>, everything else is a <p>, matching the styling the
// hand-written policy pages (PrivacyPolicy.tsx etc.) already use via the
// shared .policy-content CSS rules.
function renderParagraphs(paragraphs: string[]) {
  const nodes: JSX.Element[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={key}>
        {bulletBuffer.map((item, i) => (
          <li key={i}>{item.replace(/^•\s*/, "")}</li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  paragraphs.forEach((p, i) => {
    if (p.trim().startsWith("•")) {
      bulletBuffer.push(p);
    } else {
      flushBullets(`ul-${i}`);
      nodes.push(<p key={i}>{p}</p>);
    }
  });
  flushBullets("ul-end");

  return nodes;
}

export default function PolicyDocPage() {
  const { docId } = useParams<{ docId: string }>();
  const doc = docId ? LEGAL_DOCS[docId] : undefined;

  if (!doc) return <Navigate to="/policies" replace />;

  return (
    <SEO
      title={`${doc.title} - Wayzyy`}
      description={doc.subtitle}
      path={`/policies/${doc.id}`}
    >
      <PolicyLayout title={doc.title} subtitle={doc.subtitle} effectiveDate={`Version 1.0 · Effective ${EFFECTIVE_DATE}`}>
        {doc.sections.map((section, i) => (
          <div key={i}>
            {section.heading && <h2>{section.heading}</h2>}
            {renderParagraphs(section.paragraphs)}
          </div>
        ))}
      </PolicyLayout>
    </SEO>
  );
}
