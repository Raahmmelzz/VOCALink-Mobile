import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { profileStyles as styles } from "../../styles/profileStyles";

// ─── Types ──────────────────────────────────────────────────────────
type UserRole = "teacher" | "student";

interface ProfileScreenProps {
  role?: UserRole;
}

// ─── Accent constants ────────────────────────────────────────────────
const TEAL         = "#2E9E8E";
const TEAL_LIGHT   = "#E8F5F3";
const PURPLE       = "#7C5CBF";
const PURPLE_LIGHT = "#EDE8F7";
const WHITE        = "#FFFFFF";
const GREEN        = "#4CAF50";
const TEXT3        = "#9A9895";
const BORDER       = "#E2E0DC";
const GRAY_DOT     = "#C0BEB9";
const ORANGE       = "#E87C3E";
const ORANGE_LIGHT = "#FEF0E7";

// ─── Shared sub-components ───────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

const FieldRow = ({
  label,
  value,
  editing,
  onChange,
  secureTextEntry = false,
  editable = true,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
    {editing && editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        style={[styles.fieldInput, { borderColor: TEAL }]}
        placeholderTextColor={TEXT3}
      />
    ) : (
      <Text style={styles.fieldValue}>{value}</Text>
    )}
  </View>
);

const ToggleRow = ({
  label,
  sub,
  value,
  onChange,
  accentColor = TEAL,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: () => void;
  accentColor?: string;
}) => (
  <View style={styles.toggleRow}>
    <View style={{ flex: 1, marginRight: 12 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {sub ? <Text style={styles.toggleSub}>{sub}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#D3D1C7", true: accentColor }}
      thumbColor={WHITE}
    />
  </View>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ════════════════════════════════════════════════════════════════════
// TEACHER PROFILE
// ════════════════════════════════════════════════════════════════════
function TeacherProfile() {
  const router = useRouter();
  const [tab, setTab]         = useState<"profile" | "settings">("profile");
  const [photo, setPhoto]     = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [name,  setName]  = useState("Mrs. Reyes");
  const [email, setEmail] = useState("t.reyes@mabinies.edu.ph");
  const [phone, setPhone] = useState("+63 917 123 4567");
  const [room,  setRoom]  = useState("Room 204");
  const [dept,  setDept]  = useState("SNED");
  const [bio,   setBio]   = useState("SNED teacher specializing in AAC strategies for non-verbal students.");

  const [savedName, setSavedName] = useState("Mrs. Reyes");
  const [savedRoom, setSavedRoom] = useState("Room 204");
  const [savedDept, setSavedDept] = useState("SNED");

  const [notifs, setNotifs] = useState({
    urgentMessages: true, aacRequests: true, studentIdle: false,
    broadcastReminder: true, sessionSummary: false,
    inApp: true, emailAlerts: true, smsAlerts: false, soundAlerts: true,
  });
  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(p => ({ ...p, [key]: !p[key] }));

  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const save = () => {
    setSavedName(name); setSavedRoom(room); setSavedDept(dept);
    setEditing(false);
    Alert.alert("Saved", "Your profile has been updated.");
  };
  const cancel = () => {
    setName(savedName); setRoom(savedRoom); setDept(savedDept);
    setEditing(false);
  };

  const pickPhoto = () => {
    Alert.alert("Upload photo", "Choose an option", [
      { text: "Camera",        onPress: () => {} },
      { text: "Photo library", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {tab === "profile" ? "Profile" : "Settings"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Avatar ──────────────────────────────────────────────────── */}
      {tab === "profile" && (
        <View style={[styles.avatarSection, { borderBottomColor: BORDER }]}>
          <TouchableOpacity onPress={pickPhoto}>
            <View style={[styles.avatarCircle, { borderColor: TEAL, backgroundColor: TEAL_LIGHT }]}>
              {photo
                ? <Image source={{ uri: photo }} style={styles.avatarImage} />
                : <Text style={[styles.avatarInitials, { color: TEAL }]}>MR</Text>
              }
              <View style={[styles.avatarEditBadge, { backgroundColor: TEAL }]}>
                <Text style={styles.avatarEditIcon}>✎</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarName}>{savedName}</Text>
          <Text style={styles.avatarSub}>SNED Teacher · {savedRoom}</Text>
          <View style={[styles.onlinePill, { backgroundColor: TEAL_LIGHT }]}>
            <View style={[styles.onlineDot, { backgroundColor: GREEN }]} />
            <Text style={[styles.onlineText, { color: TEAL }]}>Online</Text>
          </View>
        </View>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderTopColor: BORDER }]}>
        {(["profile", "settings"] as const).map(t => (
          <TouchableOpacity key={t} style={styles.tabItem} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && { color: TEAL, fontWeight: "600" }]}>
              {t === "profile" ? "Profile" : "Settings"}
            </Text>
            {tab === t && <View style={[styles.tabIndicator, { backgroundColor: TEAL }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tab === "profile" && (
          <>
            <Card style={{ marginBottom: 12 }}>
              {[
                { label: "Employee ID",  value: "TCH-2019-044" },
                { label: "Department",   value: savedDept },
                { label: "Member since", value: "June 2019" },
                { label: "Last login",   value: "Today, 7:48 AM" },
              ].map(r => (
                <View key={r.label} style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{r.label}</Text>
                  <Text style={styles.metaValue}>{r.value}</Text>
                </View>
              ))}
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Personal information</Text>
                {!editing && (
                  <TouchableOpacity onPress={() => setEditing(true)} style={[styles.editBtn, { borderColor: TEAL }]}>
                    <Text style={[styles.editBtnText, { color: TEAL }]}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
              <FieldRow label="Display name"  value={name}  editing={editing} onChange={setName} />
              <FieldRow label="Email"          value={email} editing={editing} onChange={setEmail} />
              <FieldRow label="Contact"        value={phone} editing={editing} onChange={setPhone} />
              <FieldRow label="Room / Section" value={room}  editing={editing} onChange={setRoom} />
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>BIO</Text>
                {editing ? (
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={3}
                    style={[styles.fieldInput, { borderColor: TEAL, height: 72, textAlignVertical: "top" }]}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { lineHeight: 20 }]}>{bio}</Text>
                )}
              </View>
              {editing && (
                <View style={styles.saveRow}>
                  <TouchableOpacity onPress={cancel} style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: TEAL }]}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>

            <View style={styles.statsRow}>
              {[
                { label: "Students online", value: "3",  color: TEAL,   bg: TEAL_LIGHT   },
                { label: "Messages today",  value: "12", color: PURPLE, bg: PURPLE_LIGHT },
                { label: "Sessions / week", value: "5",  color: ORANGE, bg: ORANGE_LIGHT },
              ].map(s => (
                <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "settings" && (
          <>
            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>Change password</Text>
              {[
                { label: "Current password",    val: currentPw, set: setCurrentPw },
                { label: "New password",         val: newPw,     set: setNewPw },
                { label: "Confirm new password", val: confirmPw, set: setConfirmPw },
              ].map(f => (
                <View key={f.label} style={{ marginBottom: 10 }}>
                  <Text style={styles.pwFieldLabel}>{f.label}</Text>
                  <TextInput
                    value={f.val}
                    onChangeText={f.set}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={TEXT3}
                    style={styles.pwInput}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: TEAL, marginTop: 4 }]}
                onPress={() => { Alert.alert("Password updated"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
              >
                <Text style={styles.saveBtnText}>Update password</Text>
              </TouchableOpacity>
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <SectionLabel>Student messages</SectionLabel>
              <ToggleRow label="Urgent messages"     sub="Immediate alert for urgent flags"  value={notifs.urgentMessages}    onChange={() => toggleNotif("urgentMessages")} />
              <ToggleRow label="New AAC requests"    sub="When a student sends a request"    value={notifs.aacRequests}       onChange={() => toggleNotif("aacRequests")} />
              <ToggleRow label="Student goes idle"   sub="No response in 10 min"             value={notifs.studentIdle}       onChange={() => toggleNotif("studentIdle")} />
              <SectionLabel>System</SectionLabel>
              <ToggleRow label="Broadcast reminders" sub="Before a scheduled STT broadcast"  value={notifs.broadcastReminder} onChange={() => toggleNotif("broadcastReminder")} />
              <ToggleRow label="Session summary"     sub="Daily summary at end of period"    value={notifs.sessionSummary}    onChange={() => toggleNotif("sessionSummary")} />
              <SectionLabel>Delivery</SectionLabel>
              <ToggleRow label="In-app"       value={notifs.inApp}       onChange={() => toggleNotif("inApp")} />
              <ToggleRow label="Email"        value={notifs.emailAlerts} onChange={() => toggleNotif("emailAlerts")} />
              <ToggleRow label="SMS"          value={notifs.smsAlerts}   onChange={() => toggleNotif("smsAlerts")} />
              <ToggleRow label="Sound alerts" value={notifs.soundAlerts} onChange={() => toggleNotif("soundAlerts")} />
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>Active sessions</Text>
              {[
                { device: "Chrome on Windows — Computer Lab", time: "Active now",   active: true  },
                { device: "Safari on iPhone — Mobile",        time: "Apr 18, 2026", active: false },
                { device: "Chrome on Android — Tablet",       time: "Apr 14, 2026", active: false },
              ].map(s => (
                <View key={s.device} style={styles.sessionRow}>
                  <View style={[styles.sessionDot, { backgroundColor: s.active ? GREEN : GRAY_DOT }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionDevice}>{s.device}</Text>
                    <Text style={styles.sessionTime}>{s.active ? "Active now" : `Last active ${s.time}`}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={[styles.dangerOutlineBtn, { marginTop: 12 }]}>
                <Text style={styles.dangerOutlineBtnText}>Sign out all other sessions</Text>
              </TouchableOpacity>
            </Card>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Danger zone</Text>
              <Text style={styles.dangerBody}>
                Permanently delete your account and all associated data. This cannot be undone.
              </Text>
              <TouchableOpacity style={styles.dangerOutlineBtn}>
                <Text style={styles.dangerOutlineBtnText}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════
// STUDENT PROFILE
// ════════════════════════════════════════════════════════════════════
function StudentProfile() {
  const router = useRouter();
  const [tab, setTab]         = useState<"profile" | "settings">("profile");
  const [photo, setPhoto]     = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [name,          setName]     = useState("Juan dela Cruz");
  const [guardian,      setGuardian] = useState("Maria dela Cruz");
  const [guardianPhone, setGPhone]   = useState("+63 912 345 6789");
  const [savedName,  setSavedName]   = useState("Juan dela Cruz");

  const [notifs, setNotifs] = useState({
    teacherMessages: true, broadcastAlerts: true,
    sessionReminder: false, soundAlerts: true,
  });
  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(p => ({ ...p, [key]: !p[key] }));

  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const save   = () => { setSavedName(name); setEditing(false); Alert.alert("Saved", "Your profile has been updated."); };
  const cancel = () => { setName(savedName); setEditing(false); };

  const pickPhoto = () => {
    Alert.alert("Upload photo", "Choose an option", [
      { text: "Camera",        onPress: () => {} },
      { text: "Photo library", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {tab === "profile" ? "My Profile" : "Settings"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Avatar ──────────────────────────────────────────────────── */}
      {tab === "profile" && (
        <View style={[styles.avatarSection, { borderBottomColor: BORDER }]}>
          <TouchableOpacity onPress={pickPhoto}>
            <View style={[styles.avatarCircle, { borderColor: PURPLE, backgroundColor: PURPLE_LIGHT }]}>
              {photo
                ? <Image source={{ uri: photo }} style={styles.avatarImage} />
                : <Text style={[styles.avatarInitials, { color: PURPLE }]}>JD</Text>
              }
              <View style={[styles.avatarEditBadge, { backgroundColor: PURPLE }]}>
                <Text style={styles.avatarEditIcon}>✎</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarName}>{savedName}</Text>
          <Text style={styles.avatarSub}>SNED-A · Grade 5</Text>
          <View style={[styles.onlinePill, { backgroundColor: TEAL_LIGHT }]}>
            <View style={[styles.onlineDot, { backgroundColor: GREEN }]} />
            <Text style={[styles.onlineText, { color: TEAL }]}>Online</Text>
          </View>
        </View>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderTopColor: BORDER }]}>
        {(["profile", "settings"] as const).map(t => (
          <TouchableOpacity key={t} style={styles.tabItem} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && { color: PURPLE, fontWeight: "600" }]}>
              {t === "profile" ? "Profile" : "Settings"}
            </Text>
            {tab === t && <View style={[styles.tabIndicator, { backgroundColor: PURPLE }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tab === "profile" && (
          <>
            <View style={styles.statsRow}>
              {[
                { label: "AAC words used", value: "142", color: TEAL,   bg: TEAL_LIGHT   },
                { label: "Messages sent",  value: "38",  color: PURPLE, bg: PURPLE_LIGHT },
                { label: "Sessions",       value: "21",  color: ORANGE, bg: ORANGE_LIGHT },
              ].map(s => (
                <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>{"Today's session"}</Text>
              {[
                { label: "Subject", value: "Science"    },
                { label: "Teacher", value: "Mrs. Reyes" },
                { label: "Section", value: "SNED-A"     },
              ].map(r => (
                <View key={r.label} style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{r.label}</Text>
                  <Text style={styles.metaValue}>{r.value}</Text>
                </View>
              ))}
            </Card>

            <Card>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>My information</Text>
                {!editing && (
                  <TouchableOpacity onPress={() => setEditing(true)} style={[styles.editBtn, { borderColor: PURPLE }]}>
                    <Text style={[styles.editBtnText, { color: PURPLE }]}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
              <FieldRow label="Full name"        value={name}                     editing={editing} onChange={setName} />
              <FieldRow label="Student ID"       value="STU-2023-011"             editing={false}   editable={false} />
              <FieldRow label="School"           value="Mabini Elementary School" editing={false}   editable={false} />
              <FieldRow label="Guardian name"    value={guardian}                 editing={editing} onChange={setGuardian} />
              <FieldRow label="Guardian contact" value={guardianPhone}            editing={editing} onChange={setGPhone} />
              <FieldRow label="Member since"     value="June 2023"                editing={false}   editable={false} />
              {editing && (
                <View style={styles.saveRow}>
                  <TouchableOpacity onPress={cancel} style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: PURPLE }]}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          </>
        )}

        {tab === "settings" && (
          <>
            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>Change password</Text>
              {[
                { label: "Current password",    val: currentPw, set: setCurrentPw },
                { label: "New password",         val: newPw,     set: setNewPw },
                { label: "Confirm new password", val: confirmPw, set: setConfirmPw },
              ].map(f => (
                <View key={f.label} style={{ marginBottom: 10 }}>
                  <Text style={styles.pwFieldLabel}>{f.label}</Text>
                  <TextInput
                    value={f.val}
                    onChangeText={f.set}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={TEXT3}
                    style={styles.pwInput}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: PURPLE, marginTop: 4 }]}
                onPress={() => { Alert.alert("Password updated"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
              >
                <Text style={styles.saveBtnText}>Update password</Text>
              </TouchableOpacity>
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <ToggleRow label="Teacher messages"  sub="Alert when teacher sends a message"     value={notifs.teacherMessages} onChange={() => toggleNotif("teacherMessages")} accentColor={PURPLE} />
              <ToggleRow label="Broadcast alerts"  sub="Alert for class-wide announcements"     value={notifs.broadcastAlerts} onChange={() => toggleNotif("broadcastAlerts")} accentColor={PURPLE} />
              <ToggleRow label="Session reminders" sub="Remind me when class is about to start" value={notifs.sessionReminder} onChange={() => toggleNotif("sessionReminder")} accentColor={PURPLE} />
              <ToggleRow label="Sound alerts"      sub="Play a sound for new messages"          value={notifs.soundAlerts}     onChange={() => toggleNotif("soundAlerts")}     accentColor={PURPLE} />
            </Card>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Danger zone</Text>
              <Text style={styles.dangerBody}>
                Permanently delete your account and all associated data. This cannot be undone.
              </Text>
              <TouchableOpacity style={styles.dangerOutlineBtn}>
                <Text style={styles.dangerOutlineBtnText}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════
// ROOT — role defaults to "student" until auth context is built
// ════════════════════════════════════════════════════════════════════
export default function ProfileScreen({ role = "student" }: ProfileScreenProps) {
  if (role === "teacher") return <TeacherProfile />;
  return <StudentProfile />;
}
