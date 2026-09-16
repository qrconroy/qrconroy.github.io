function toggleMenu(id) {
            const el = document.getElementById(id);
            const wasOpen = el.classList.contains('open');
            document.querySelectorAll('.nav-item.open').forEach((e) => e.classList.remove('open'));
            if (!wasOpen) el.classList.add('open');
            }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item')) {
                document.querySelectorAll('.nav-item.open').forEach((el) => el.classList.remove('open'));
            }
        });