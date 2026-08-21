import React from "react";
import ContactClient from "@/components/features/contact/ContactClient";
import { ContactService } from "@/services/contact.service";

export default async function ContactDataWrapper() {
  const data = await ContactService.getContactInfo();

  // Pass data to client (with fallbacks if null)
  return <ContactClient initialData={data || { emails: [], emailChannels: [], phones: [], phoneChannels: [] }} />;
}
