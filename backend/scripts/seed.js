/**
 * scripts/seed.js
 * Uso: node scripts/seed.js
 */

const axios = require('axios');

const BASE_URL = process.env.SEED_BASE_URL || 'http://localhost:5000/api';

// util simples
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function registerUser({ name, email, password, cpf, phone, role = 'user' }) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name, email, password, cpf, phone, role
    });
    console.log(`Registered ${email} (${role})`);
    return res.data;
  } catch (err) {
    console.warn(`Register failed ${email}:`, err.response?.data || err.message);
    return null;
  }
}

async function login(email, password) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return res.data.token;
  } catch (err) {
    console.warn('Login failed for', email, err.response?.data || err.message);
    return null;
  }
}

async function createPet(token, pet) {
  try {
    const res = await axios.post(`${BASE_URL}/pets`, pet, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('  Pet created:', res.data.nome || res.data._id);
    return res.data;
  } catch (err) {
    console.warn('  Create pet failed:', err.response?.data || err.message);
    return null;
  }
}

async function createCampaign(token, campaign) {
  try {
    const res = await axios.post(`${BASE_URL}/campaigns`, campaign, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('  Campaign created:', res.data._id || res.data);
    return res.data;
  } catch (err) {
    console.warn('  Create campaign failed:', err.response?.data || err.message);
    return null;
  }
}

async function enrollPet(token, campaignId, petId) {
  try {
    // ajuste esta rota se a sua for diferente:
    // POST /api/campaigns/:id/enroll  body: { petId }
    const res = await axios.post(`${BASE_URL}/campaigns/${campaignId}/enroll`, { petId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`    Enrolled pet ${petId} -> campaign ${campaignId}`);
    return res.data;
  } catch (err) {
    console.warn(`    Enroll failed pet ${petId}:`, err.response?.data || err.message);
    return null;
  }
}

async function main() {
  console.log('--- Seed script started ---');

  const managerCreds = { name: 'Manager Test', email: 'manager@example.com', password: 'Pass1234', cpf: '11122233344', phone: '21999990000', role: 'manager' };
  const superCreds   = { name: 'Super Test',   email: 'super@example.com',   password: 'Pass1234', cpf: '99988877766', phone: '21988880000', role: 'superadmin' };

  await registerUser(superCreds);
  await registerUser(managerCreds);

  const normalUsers = [
    { name: 'Alice Silva', email: 'alice@example.com', password: 'Pass1234', cpf: '12345678901', phone: '21970000001' },
    { name: 'Bruno Costa', email: 'bruno@example.com', password: 'Pass1234', cpf: '12345678902', phone: '21970000002' },
    { name: 'Carla Reis',  email: 'carla@example.com', password: 'Pass1234', cpf: '12345678903', phone: '21970000003' },
    { name: 'Diego Lima',  email: 'diego@example.com', password: 'Pass1234', cpf: '12345678904', phone: '21970000004' },
    { name: 'Eva Moura',   email: 'eva@example.com',   password: 'Pass1234', cpf: '12345678905', phone: '21970000005' },
  ];

  for (const u of normalUsers) {
    await registerUser(u);
    await sleep(150);
  }

  const superToken   = await login(superCreds.email,   superCreds.password);
  const managerToken = await login(managerCreds.email, managerCreds.password);

  const userTokens = {};
  const createdPetsByUser = {};

  for (const u of normalUsers) {
    const tok = await login(u.email, u.password);
    userTokens[u.email] = tok;
    createdPetsByUser[u.email] = [];

    if (tok) {
      const petNames = ['Thor','Luna','Bob','Mimi','Nina','Zeus','Kiki'];
      const breeds   = ['Vira-lata','SRD','Poodle','Labrador','Shih Tzu','SRD'];
      const types    = ['Cachorro','Gato'];
      const numPets  = 1 + Math.floor(Math.random()*3);

      for (let i = 0; i < numPets; i++) {
        const pet = {
          nome: `${pickRandom(petNames)}_${i+1}`,
          tipo: pickRandom(types).toLowerCase(),
          raca: pickRandom(breeds),
          peso: (3 + Math.floor(Math.random()*20)).toString(),
          idade: (1 + Math.floor(Math.random()*10)).toString(),
          nomeTutor: u.name,
          cpfTutor: u.cpf,
          telefoneTutor: u.phone,
          dataCadastro: new Date().toLocaleDateString('pt-BR'),
          // imagem: omitida para evitar payload grande
        };
        const created = await createPet(tok, pet);
        if (created && created._id) {
          createdPetsByUser[u.email].push(created);
        }
        await sleep(120);
      }
    }
  }

  const campaignTemplates = [
    { cep: '22041001', day: offsetDateStr(-10), time: '09:00-13:00', capacity: 15, address: { city: 'Rio de Janeiro', neighborhood: 'Copacabana', street: 'Av. Atlântica' }, number: '100', placeName: 'Praça X', reference: 'Em frente ao quiosque' },
    { cep: '20040030', day: offsetDateStr(-35), time: '08:00-12:00', capacity: 20, address: { city: 'Rio de Janeiro', neighborhood: 'Centro', street: 'Rua Primeiro' }, number: '50', placeName: 'Escola Y', reference: 'Ao lado da igreja' },
    { cep: '23060000', day: offsetDateStr(-65), time: '13:00-17:00', capacity: 12, address: { city: 'Niterói', neighborhood: 'Icaraí', street: 'Rua das Flores' }, number: '200', placeName: 'Clínica Z', reference: 'Próximo ao mercado' },
  ];

  const campaignsCreated = [];
  for (const tpl of campaignTemplates) {
    const cam = await createCampaign(managerToken || superToken, tpl);
    if (cam && cam._id) campaignsCreated.push(cam);
    await sleep(200);
  }

  for (const cam of campaignsCreated) {
    const needed = Math.min(cam.capacity || 10, 6);
    let added = 0;
    for (const u of normalUsers) {
      if (added >= needed) break;
      const pets = createdPetsByUser[u.email] || [];
      if (!pets.length) continue;
      const pet = pets[Math.floor(Math.random()*pets.length)];
      const ownerToken = userTokens[u.email];
      if (!ownerToken) continue;

      const r = await enrollPet(ownerToken, cam._id, pet._id);
      if (r) added++;
      await sleep(120);
    }
    console.log(`Campaign ${cam._id} has ${added} seeded registrations`);
  }

  console.log('--- Seed finished ---');
  process.exit(0);
}

/** helpers **/
function offsetDateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

main().catch(e => {
  console.error('Seed script error', e);
  process.exit(1);
});
