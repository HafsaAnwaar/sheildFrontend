import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEFF2",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E63946", // strong red
  },
  profileButton: {
    padding: 8,
  },
  profileText: {
    fontSize: 20,
  },
  sosButton: {
    alignSelf: "center",
    backgroundColor: "#E63946",
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 6,
  },
  sosText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#1D3557",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
     marginBottom: 25,
  },
  navItem: {
    fontSize: 16,
  },
});

export default styles;
