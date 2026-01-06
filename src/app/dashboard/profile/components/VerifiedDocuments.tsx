import React, { useState } from 'react';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import { CheckCircle2, FileCheck, ShieldCheck, Upload } from 'lucide-react';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

interface VerifiedDocumentsProps {
  verified: boolean;
  hostType: string;
  hasSubmitted:boolean;
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

export const VerifiedDocuments: React.FC<VerifiedDocumentsProps> = ({ verified, hostType, hasSubmitted }) => {
  const [businessRegFile, setBusinessRegFile] = useState<File | null>(null);
  const [cancelledChequeFile, setCancelledChequeFile] = useState<File | null>(null);
  const [nonGstFile, setNonGstFile] = useState<File | null>(null);

  const { uploadDocuments, isLoading } = useDocumentUpload({
    onSuccess: () => {
      setBusinessRegFile(null);
      setCancelledChequeFile(null);
      setNonGstFile(null);
    },
  });

  const handleUpload = () => {
    uploadDocuments({
      businessRegistrationCertificate: businessRegFile,
      cancelledCheque: cancelledChequeFile,
      nonGSTDeclaration: nonGstFile,
    });
  };
  console.log(verified,hasSubmitted)
  if (verified && hasSubmitted) {
    const documents = hostType === 'Organization' 
      ? [
          { id: 1, name: 'Business Registration Certificate', verified: true },
          { id: 2, name: 'Cancelled Cheque', verified: true },
        ]
      : [
          { id: 1, name: 'Non-GST Declaration', verified: true },
          { id: 2, name: 'Cancelled Cheque', verified: true },
        ];

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
  }
  if (!verified && hasSubmitted) {
    const documents = hostType === 'Organization' 
      ? [
          { id: 1, name: 'Business Registration Certificate', verified: false },
          { id: 2, name: 'Cancelled Cheque', verified: false },
        ]
      : [
          { id: 1, name: 'Non-GST Declaration', verified: false },
          { id: 2, name: 'Cancelled Cheque', verified: false },
        ];

    return (
      <Card className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-yellow-600" />
          <h2 className="text-base text-neutral-900">Documents Under Review</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <DocumentItem key={doc.id} name={doc.name} verified={doc.verified} />
          ))}
        </div>
        
        <div className="px-3 py-4 bg-yellow-50/50 rounded-2xl border border-yellow-100">
          <p className="text-xs text-yellow-900 leading-5">
            ⏳ Verification is under process and our team will verify soon.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-orange-600" />
        <h2 className="text-base text-neutral-900">Upload Documents</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {hostType === 'Organization' ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Business Registration Certificate</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setBusinessRegFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Cancelled Cheque</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCancelledChequeFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Non-GST Declaration</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setNonGstFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Cancelled Cheque</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCancelledChequeFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </>
        )}
      </div>
      
      <Button
        onClick={handleUpload}
        disabled={isLoading || (hostType === 'Organization' ? !businessRegFile || !cancelledChequeFile : !nonGstFile || !cancelledChequeFile)}
        className="w-full"
      >
        {isLoading ? 'Uploading...' : 'Upload Documents'}
        <Upload size={16} />
      </Button>
      
      <div className="px-3 py-4 bg-orange-50/50 rounded-2xl border border-orange-100">
        <p className="text-xs text-orange-900 leading-5">
          ⚠️ Please upload clear, readable documents. These will be verified by our team.
        </p>
      </div>
    </Card>
  );
};
