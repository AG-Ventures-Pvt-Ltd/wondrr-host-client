import React from 'react';
import Card from '@/common/components/composites/Card';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
    return (
        <Card className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-neutral-400" />
                <h2 className="text-base text-maintext">Frequently Asked Questions</h2>
            </div>
            <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className="px-4 py-3 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex flex-col gap-2"
                    >
                        <h3 className="text-sm text-maintext">{faq.question}</h3>
                        <p className="text-sm text-neutral-600 leading-6">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default FAQ;
