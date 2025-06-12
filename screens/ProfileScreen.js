import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { GlobalStyles } from "../constants/colors";
import IconButton from "../components/IconButton";
import { AuthContext } from "../store/auth-context";
import AuthInput from "../components/Auth/AuthInput";

import { supabase } from "../services/supabase";

import {
  User,
  GenderIntersex,
  Ruler,
  Scales,
  Calendar,
  EnvelopeSimple,
  Key,
} from "phosphor-react-native";

function ProfileScreen() {
  const authContext = useContext(AuthContext);

  // Perfil
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  // Conta
  const [login, setLogin] = useState(
    authContext.user?.email || "email@email.com"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.email) setLogin(data.user.email);
    }
    fetchUser();
  }, []);

  function logoutHandler() {
    authContext.logout();
  }

  function updateProfileHandler() {
    // Implemente a lógica de atualização do perfil
  }

  function updatePasswordHandler() {
    // Implemente a lógica de atualização de senha
  }

  function deleteAccountHandler() {
    // Implemente a lógica de exclusão de conta
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Card de Perfil */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <User size={22} color={GlobalStyles.colors.primary} weight="bold" />
          <Text style={styles.cardTitleText}>Perfil</Text>
        </View>
        <AuthInput
          label="Nome"
          value={name}
          onUpdateValue={setName}
          icon={<User size={20} color={GlobalStyles.colors.primary} />}
        />
        <AuthInput
          label="Sexo"
          value={gender}
          onUpdateValue={setGender}
          icon={
            <GenderIntersex size={20} color={GlobalStyles.colors.primary} />
          }
        />
        <AuthInput
          label="Altura (cm)"
          value={height}
          onUpdateValue={setHeight}
          keyboardType="numeric"
          icon={<Ruler size={20} color={GlobalStyles.colors.primary} />}
        />
        <AuthInput
          label="Peso (kg)"
          value={weight}
          onUpdateValue={setWeight}
          keyboardType="numeric"
          icon={<Scales size={20} color={GlobalStyles.colors.primary} />}
        />
        <AuthInput
          label="Idade"
          value={age}
          onUpdateValue={setAge}
          keyboardType="numeric"
          icon={<Calendar size={20} color={GlobalStyles.colors.primary} />}
        />
        <IconButton
          title="Atualizar Perfil"
          color={GlobalStyles.colors.primary}
          size={20}
          icon="UserCircle"
          onPress={updateProfileHandler}
        />
      </View>

      {/* Card de Conta */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <EnvelopeSimple
            size={22}
            color={GlobalStyles.colors.primary}
            weight="bold"
          />
          <Text style={styles.cardTitleText}>Conta</Text>
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.loginText}>{login}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar senha</Text>
          <AuthInput
            label="Nova Senha"
            value={password}
            onUpdateValue={setPassword}
            secure
            icon={<Key size={20} color={GlobalStyles.colors.primary} />}
          />
          <AuthInput
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onUpdateValue={setConfirmPassword}
            secure
            icon={<Key size={20} color={GlobalStyles.colors.primary} />}
          />
          <IconButton
            title="Atualizar Senha"
            color={GlobalStyles.colors.primary}
            size={20}
            icon="Key"
            onPress={updatePasswordHandler}
            style={styles.buttonSpacing}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações da conta</Text>
          <View style={styles.sectionRow}>
            <IconButton
              title="Excluir Conta"
              color="#e53935"
              textColor="#fff"
              size={20}
              icon={"Trash"}
              onPress={deleteAccountHandler}
              style={[styles.buttonSpacing, styles.deleteButton]}
            />
            <IconButton
              title="Sair"
              color={GlobalStyles.colors.background}
              textColor={GlobalStyles.colors.primary}
              size={20}
              icon={"SignOut"}
              onPress={logoutHandler}
              style={styles.buttonSpacing}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.background,
  },
  card: {
    backgroundColor: GlobalStyles.colors.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
    marginBottom: 12,
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
    marginBottom: 8,
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
  },
  loginText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#888",
  },
  sectionRow: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 8,
    borderTopColor: "#888",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: GlobalStyles.colors.primary,
    marginBottom: 8,
    marginLeft: 2,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
    borderRadius: 2,
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
  },
  loginText: {
    fontSize: 16,
    color: GlobalStyles.colors.text,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary,
  },
});
