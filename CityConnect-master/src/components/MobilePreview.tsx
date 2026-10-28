import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, XCircle, AlertTriangle, Info, Send, RefreshCw, ShieldAlert } from 'lucide-react';
import { Resident, Disruption, NotificationRecord } from '../types';
import { generateBaselineMessage, generatePersonalizedMessage } from '../services/messageGenerator';
import { speakText, stopSpeech } from '../services/speechService';
import { submitFeedback } from '../services/api';

interface MobilePreviewProps {
  resident: Resident;
  disruption: Disruption;
  notification?: NotificationRecord;
  onFeedbackSubmitted?: () => void;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({
  resident,
  disruption,
  notification,
  onFeedbackSubmitted,
}) => {
  const [useBaseline, setUseBaseline] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [understandable, setUnderstandable] = useState<'Yes' | 'No' | null>(
    notification?.understandability === 'Yes' ? 'Yes' : notification?.understandability === 'No' ? 'No' : null
  );
  const [relevant, setRelevant] = useState<'Yes' | 'No' | null>(
    notification?.relevance === 'Yes' ? 'Yes' : notification?.relevance === 'No' ? 'No' : null
  );
  const [feedbackText, setFeedbackText] = useState(notification?.feedbackText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Generate prototype message dynamically
  const protoResult = generatePersonalizedMessage(disruption, resident);
  const baselineMsg = generateBaselineMessage(disruption);

  const displayedMessage = useBaseline ? baselineMsg : protoResult.message;

  const handleAudioToggle = async () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      await speakText(displayedMessage, useBaseline ? 'English' : protoResult.language);
      setIsPlayingAudio(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!understandable || !relevant) return;
    setIsSubmitting(true);
    try {
      const notifId = notification?.id || `notif-preview-${Date.now()}`;
      await submitFeedback(notifId, understandable, relevant, feedbackText);
      setSubmittedSuccess(true);
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame Container */}
      <div className="w-full max-w-sm bg-slate-950 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
        
        {/* Notch / Speaker bar */}
        <div className="w-32 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-3 pb-2 border-b border-slate-800">
          <span className="font-semibold text-slate-300">CityConnect App</span>
          <div className="flex items-center space-x-2">
            <span className="bg-civic-900 text-civic-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">
              {resident.notificationChannel}
            </span>
            <span>09:41</span>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="bg-slate-900/90 rounded-xl p-3 my-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <span>{resident.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({resident.zone})</span>
              </p>
              <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px]">
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  🗣️ {resident.preferredLanguage}
                </span>
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  ♿ {resident.accessibilityNeeds}
                </span>
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  🚌 {resident.assignedRoute}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle Switch: Baseline vs Personalized Prototype */}
        <div className="bg-slate-900 p-1 rounded-lg flex text-xs mb-3 border border-slate-800">
          <button
            onClick={() => setUseBaseline(false)}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all text-center ${
              !useBaseline
                ? 'bg-civic-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Intelligent Prototype
          </button>
          <button
            onClick={() => setUseBaseline(true)}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all text-center ${
              useBaseline
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Simple Baseline
          </button>
        </div>

        {/* Edge Case Warning Badges */}
        {!useBaseline && (
          <div className="space-y-1 mb-2">
            {protoResult.isLanguageFallback && (
              <div className="bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Edge Case 2:</strong> Language fallback used (English)</span>
              </div>
            )}
            {protoResult.isLocationUnknown && (
              <div className="bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Edge Case 1:</strong> Location unknown (Route matched)</span>
              </div>
            )}
            {protoResult.isAccessibilityDefault && (
              <div className="bg-blue-950/80 border border-blue-500/40 text-blue-300 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Edge Case 3:</strong> Accessible default format used</span>
              </div>
            )}
            {protoResult.isApiFallback && (
              <div className="bg-purple-950/80 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span><strong>Edge Case 7:</strong> Local deterministic fallback used</span>
              </div>
            )}
          </div>
        )}

        {/* Main Notification Card */}
        <div
          className={`rounded-2xl p-4 transition-all duration-300 shadow-md border ${
            resident.accessibilityNeeds === 'High contrast' && !useBaseline
              ? 'bg-black text-amber-300 border-amber-400 font-bold'
              : 'bg-slate-900 text-slate-100 border-slate-800'
          }`}
        >
          {/* Header & Severity */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-civic-400">
              {disruption.department}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                disruption.severity === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border border-rose-600'
                  : disruption.severity === 'High'
                  ? 'bg-amber-950 text-amber-300 border border-amber-600'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {disruption.severity} Severity
            </span>
          </div>

          {/* Message Body with accessibility size adjustments */}
          <div
            className={`whitespace-pre-line leading-relaxed ${
              resident.accessibilityNeeds === 'Large text' && !useBaseline
                ? 'text-base font-semibold space-y-1'
                : 'text-xs'
            }`}
          >
            {displayedMessage}
          </div>

          {/* Audio-Ready Listen Button 🔊 */}
          <div className="mt-4 pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleAudioToggle}
              aria-label="Listen to message audio"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-civic-700 hover:bg-civic-600 text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Stop Audio' : '🔊 Listen to message'}</span>
            </button>
          </div>
        </div>

        {/* Resident Feedback Submission Section */}
        <div className="bg-slate-900 rounded-xl p-3 mt-3 border border-slate-800 text-slate-200">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Resident Validation Feedback
          </p>

          {/* Question 1: Understandable? */}
          <div className="mb-2">
            <span className="text-xs text-slate-300 block mb-1">Was this message understandable?</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setUnderstandable('Yes')}
                className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center space-x-1 border transition-all ${
                  understandable === 'Yes'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Yes</span>
              </button>
              <button
                onClick={() => setUnderstandable('No')}
                className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center space-x-1 border transition-all ${
                  understandable === 'No'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>No</span>
              </button>
            </div>
          </div>

          {/* Question 2: Relevant? */}
          <div className="mb-2">
            <span className="text-xs text-slate-300 block mb-1">Was this message relevant to you?</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setRelevant('Yes')}
                className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center space-x-1 border transition-all ${
                  relevant === 'Yes'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Yes</span>
              </button>
              <button
                onClick={() => setRelevant('No')}
                className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center space-x-1 border transition-all ${
                  relevant === 'No'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>No</span>
              </button>
            </div>
          </div>

          {/* Feedback Text Input */}
          <div className="mt-2">
            <input
              type="text"
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Optional feedback..."
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-civic-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFeedbackSubmit}
            disabled={!understandable || !relevant || isSubmitting}
            className="w-full mt-2 bg-civic-600 hover:bg-civic-500 disabled:opacity-50 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center space-x-1 transition-all"
          >
            {isSubmitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>

          {submittedSuccess && (
            <p className="text-[10px] text-emerald-400 text-center mt-1.5 font-medium">
              ✓ Feedback submitted to dashboard metrics!
            </p>
          )}
        </div>

        {/* Home Indicator */}
        <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-3"></div>
      </div>
    </div>
  );
};
