import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.4:8080");
interface Lead {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_time: string;
}
interface LeadItemProps {
  full_name: string;
  email: string;
  phone_number: string;
}

export default function LeadScreen() {
  const [leads, setLeads] = useState<Lead[]>([]);

  // Fetch Previous Leads from Server one time when app loads
  const fetchLeads = async () => {
    try {
      console.log("fetching from MONGO");
      const response = await fetch("http://192.168.1.4:8080/leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching previous leads:", error);
    }
  };

  // Fetch from DB only if lead variable is empty
  if (leads.length === 0) {
    fetchLeads();
  }

  // Use Effect to server the side effects and listen to open socket connection events
  useEffect(() => {
    // To test socket connection
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen to the new_lead event from server
    socket.on("new_lead", (data) => {
      console.log("Recived");

      // Sort according to created time and save to lead state variable
      setLeads((prevLeads) => {
        const updatedLeads = [data.lead, ...prevLeads];
        return updatedLeads.sort((a, b) => {
          return (
            new Date(b.created_time).getTime() -
            new Date(a.created_time).getTime()
          );
        });
      });
    });

    // close connection
    return () => {
      socket.off("new_lead");
    };
  }, []);

  // Component to display lead in User friendly manner
  const LeadView = ({ full_name, email, phone_number }: LeadItemProps) => (
    <View style={styles.leadCard}>
      <Text style={{ color: "white" }}>Name: {full_name}</Text>
      <Text style={{ color: "white" }}>Email: {email}</Text>
      <Text style={{ color: "white" }}>Contact: {phone_number}</Text>
    </View>
  );

  // Conditional leads list display
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      {leads.length == 0 ? (
        <Text>No Leads</Text>
      ) : (
        <FlatList
          data={leads}
          renderItem={({ item }) => (
            <LeadView
              full_name={item.full_name}
              email={item.email}
              phone_number={item.phone_number}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  leadCard: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    gap: 3,
    padding: 20,
    backgroundColor: "#1569CF",
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
});
