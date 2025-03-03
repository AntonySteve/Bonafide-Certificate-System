"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";


const steps = ["Application Received", "Verification", "Approval", "Certificate Issued"];

const BonafideProgress = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState("Processing");

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === steps.length - 1) {
      setStatus("Approved");
    }
  };

  const handleReject = () => {
    setStatus("Rejected");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">E-Bonafide Certificate Progress</h2>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-4 text-lg">{step}</span>
              </div>
            ))}
          </div>

          <Progress value={(currentStep / steps.length) * 100} className="my-4" />

          <p className="text-center text-lg font-medium">
            Status: <span className={`font-semibold ${status === "Rejected" ? "text-red-500" : "text-blue-500"}`}>{status}</span>
          </p>

          <div className="flex justify-between mt-4">
            <Button onClick={handleReject} variant="destructive">Reject</Button>
            {status !== "Approved" && <Button onClick={handleNext}>Next Step</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonafideProgress;
