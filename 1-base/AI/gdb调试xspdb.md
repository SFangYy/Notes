```shell
gdb --batch --ex "set env LD_PRELOAD /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/xspcomm/libxspcomm.so.0.0.1" --ex "set env PYTHONPATH /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb:scripts/xspdb" --ex "run" --ex "bt full" --args python3 scripts/pdb-run.py
```

```log
gdb --batch --ex "set env LD_PRELOAD /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/xspcomm/libxspcomm.so.0.0.1" --ex "set env PYTHONPATH /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb:scripts/xspdb" --ex "run" --ex "bt full" --args python3 scripts/pdb-run.py 

[Thread debugging using libthread_db enabled] 

Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1". 

[Info] spike-dasm found, use captone to disassemble, this may cannot work for some instructions 
[New Thread 0x7ff968ff9640 (LWP 268513)] 

[New Thread 0x7ff94bfff640 (LWP 268514)] 

[New Thread 0x7ff94b7fe640 (LWP 268515)] 

[New Thread 0x7ff94affd640 (LWP 268516)] 

[New Thread 0x7ff94a7fc640 (LWP 268517)] 

[New Thread 0x7ff949ffb640 (LWP 268518)] 

[New Thread 0x7ff9497fa640 (LWP 268519)] 

[New Thread 0x7ff948ff9640 (LWP 268520)] 

[New Thread 0x7ff92bfff640 (LWP 268521)] 

[New Thread 0x7ff92b7fe640 (LWP 268522)] 

[New Thread 0x7ff92affd640 (LWP 268523)] 

[New Thread 0x7ff92a7fc640 (LWP 268524)] 

[New Thread 0x7ff929ffb640 (LWP 268525)] 

%Warning: System has stack size 8192 kb which may be too small; suggest 'ulimit -s 76453' or larger 

[Info] Set PMEM_BASE to 0x80000000 (Current: 0x80000000) 

[Info] Set FIRST_INST_ADDRESS to 0x80000000 (Current: 0x80000000) 

Using simulated 32768B flash 

[Detaching after vfork from child process 268526] 

Core  0's Commit SHA is: d9ed7c530e, dirty: 1 

  

Thread 3 "python3" received signal SIGSEGV, Segmentation fault. 
[Switching to Thread 0x7fffe779c640 (LWP 268108)] 

0x00007fffe99d2495 in v_difftest_StoreEvent (io_addr=7935805330484017975, io_data=12220182490364005012, io_mask=126 '~', io_pc=3492050784929314731, io_robidx=981, io_coreid=202 '\312', io_index=168 '\250') at /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/generated-src/difftest-dpic.cpp:1083 

1083      auto packet = &(DUT_BUF(io_coreid, 0, 0)->store[io_index]); 

#0  0x00007fffe99d2495 in v_difftest_StoreEvent (io_addr=7935805330484017975, io_data=12220182490364005012, io_mask=126 '~', io_pc=3492050784929314731, io_robidx=981, io_coreid=202 '\312', io_index=168 '\250') at /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/generated-src/difftest-dpic.cpp:1083 

        packet = 0xb80bc95b34c16c27 

#1  0x00007fffef7ee1c6 in VSimTop___024root___nba_sequent__TOP__2(VSimTop___024root*) () from /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/libUTSimTop.so 

No symbol table info available. 

#2  0x00007fffef8c22ac in VSimTop___024root__nba_mtask0(VSimTop___024root*) () from /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/libUTSimTop.so 

No symbol table info available. 

#3  0x00007fffef8e561e in VSimTop___024root____Vthread__nba__1(void*, bool) () from /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/libUTSimTop.so 

No symbol table info available. 

#4  0x00007ffff44df6b9 in VlWorkerThread::workerLoop() () from /nfs/home/songfangyuan/work/pdb/202511/new_difftest/XiangShan/build/xspdb/pyxscore/libUTSimTop.so 

No symbol table info available. 

#5  0x00007ffff7ac3253 in ?? () from /lib/x86_64-linux-gnu/libstdc++.so.6 

No symbol table info available. 

#6  0x00007ffff7ca7ac3 in start_thread (arg=<optimized out>) at ./nptl/pthread_create.c:442 

        ret = <optimized out> 

        pd = <optimized out> 

        out = <optimized out> 

        unwind_buf = {cancel_jmp_buf = {{jmp_buf = {140737488342768, -4035647029737334321, 140737076905536, 2, 140737350629328, 140737488343120, 4035593172978850255, 4035629871104743887}, mask_was_saved = 0}}, priv = {pad = {0x0, 0x0, 0x0, 0x0}, data = {prev = 0x0, cleanup = 0x0, canceltype = 0}}} 

        not_first_call = <optimized out> 

#7  0x00007ffff7d398c0 in clone3 () at ../sysdeps/unix/sysv/linux/x86_64/clone3.S:81 

No locals.


```