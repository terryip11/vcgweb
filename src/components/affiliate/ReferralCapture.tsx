"use client";

import { useEffect } from "react";
import {
  captureReferralFromSearch,
  storeReferralCode,
} from "@/lib/affiliate/referral";

export default function ReferralCapture() {
  useEffect(() => {
    const ref = captureReferralFromSearch(window.location.search);
    if (ref) storeReferralCode(ref);
  }, []);

  return null;
}
