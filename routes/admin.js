app.post('/admin/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this username already exists' });
      }
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();
      res.status(201).json({ message: 'Admin signed up successfully' });
    } catch (error) {
      console.error('Error signing up admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username, password });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateJwtToken(admin);
      res.status(200).json({ message: 'Admin logged in successfully', token });
    } catch (error) {
      console.error('Error logging in admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });