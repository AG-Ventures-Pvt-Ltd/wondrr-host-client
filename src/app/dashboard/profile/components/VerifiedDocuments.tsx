import React from 'react';
import Card from '@/common/components/composites/Card';
import { CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  verified: boolean;
}

interface VerifiedDocumentsProps {
  documents: Document[];
}

const DocumentItem: React.FC<{ name: string; verified: boolean }> = ({ name, verified }) => {
  return (
    <div className="px-3 py-3 bg-green-50/50 rounded-2xl border border-green-100 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <FileCheck size={16} className="text-green-600" />
        <span className="text-sm text-neutral-700">{name}</span>
      </div>
      {verified && (
        <CheckCircle2 size={16} className="text-green-600" />
      )}
    </div>
  );
};

export const VerifiedDocuments: React.FC<VerifiedDocumentsProps> = ({ documents }) => {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-green-600" />
        <h2 className="text-base text-neutral-900">Verified Documents</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <DocumentItem key={doc.id} name={doc.name} verified={doc.verified} />
        ))}
      </div>
      
      <div className="px-3 py-4 bg-blue-50/50 rounded-2xl border border-blue-100">
        <p className="text-xs text-blue-900 leading-5">
          ✓ All documents are verified by Wondrr. These are stored securely and not accessible for viewing.
        </p>
      </div>
    </Card>
  );
};
