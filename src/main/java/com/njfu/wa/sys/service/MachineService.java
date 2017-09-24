package com.njfu.wa.sys.service;

import com.njfu.wa.sys.domain.Block;
import com.njfu.wa.sys.domain.Machine;
import com.njfu.wa.sys.domain.util.Result;

import java.util.List;

public interface MachineService {

    /**
     * 获取机械列表
     *
     * @param machine machineId machineType useStatus
     * @param block   blockId
     * @return data
     */
    List<Machine> getMachines(Machine machine, Block block);

    /**
     * 新增机械信息
     *
     * @param machine machineId machineType useStatus machinePs
     * @param block   blockId
     * @return message
     */
    Result addMachine(Machine machine, Block block);

    /**
     * 修改机械信息
     *
     * @param machine machineId machineType useStatus machinePs
     * @param block   blockId
     * @return message
     */
    Result modifyMachine(Machine machine, Block block);

    /**
     * 删除机械信息
     *
     * @param machine machineId
     * @return message
     */
    Result removeMachine(Machine machine);
}